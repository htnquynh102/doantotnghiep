const paymentService = require("../services/PaymentService");
const { payos } = require("../utils/payos");
const db = require("../database");
const orderModel = require("../models/OrderModel");

exports.createPayment = async (req, res) => {
  try {
    const { maDonDatVe, tongTien } = req.body;
    console.log(maDonDatVe);
    console.log(tongTien);

    const orderCode = Date.now();

    const [result] = await db.query(
      `UPDATE DONDATVE set orderCode = ? WHERE maDonDatVe = ?`,
      [orderCode, maDonDatVe]
    );

    if (result.affectedRows === 0) {
      console.error("Không tìm thấy đơn để cập nhật. Có thể sai maDonDatVe?");
      return res.status(400).json({ message: "Cập nhật orderCode thất bại" });
    }

    console.log("Đã cập nhật orderCode thành công:", orderCode);

    const payment = await payos.createPaymentLink({
      orderCode: orderCode,
      amount: tongTien,
      description: `Thanh toán #${maDonDatVe}`,
      returnUrl: `http://localhost:5173/payment-result/${maDonDatVe}`,
      cancelUrl: `http://localhost:5173/payment-cancel/${maDonDatVe}`,
      expiredAt: Math.floor(Date.now() / 1000) + 15 * 60,
    });

    console.log("payment response:", payment);

    res.status(200).json({
      checkoutUrl: payment.checkoutUrl,
      qrCode: payment.qrCode,
      expiredAt: payment.expiredAt,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi tạo thanh toán", error: error.message });

    console.log(error.message);
  }
};

exports.handleWebhook = async (req, res) => {
  try {
    console.log("Nhận webhook từ PayOS:");
    console.log(JSON.stringify(req.body, null, 2));

    const { code, data, signature } = req.body;

    if (!signature) {
      // console.warn("Không có signature");
      return res.sendStatus(200);
    }

    const isValid = payos.verifyPaymentWebhookData(req.body);
    if (!isValid) {
      // console.warn("Chữ ký không hợp lệ");
      return res.status(400).send("Invalid signature");
    }

    if (code === "00" && data?.orderCode && data?.amount) {
      const chiTietDatVe = await orderModel.getChiTietDatVeById(data.orderCode);

      const nowUTC = new Date();
      const nowVN = new Date(nowUTC.getTime() + 7 * 60 * 60 * 1000);
      const thoiGianThanhToan = nowVN
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");

      await orderModel.updateOrderCompleted(data.orderCode, {
        trangThai: 1,
        thoiGianThanhToan,
        phuongThucThanhToan: "PAYOS",
        chiTietDatVe,
      });

      // console.log(`Cập nhật đơn ${data.orderCode} thành công`);
    }

    return res.sendStatus(200);
  } catch (err) {
    // console.error("Lỗi xử lý webhook:", err);
    return res.sendStatus(200);
  }
};
