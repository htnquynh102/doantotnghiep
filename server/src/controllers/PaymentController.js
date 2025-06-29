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
    await db.query(`UPDATE DONDATVE set orderCode = ? where maDonDatVe = ?`, [
      orderCode,
      maDonDatVe,
    ]);

    const payment = await payos.createPaymentLink({
      orderCode: orderCode,
      amount: tongTien,
      description: `Thanh toán #${maDonDatVe}`,
      returnUrl: `http://localhost:5173/payment-result/${maDonDatVe}`,
      cancelUrl: `http://localhost:5173/payment-cancel/${maDonDatVe}`,
      expiredAt: Math.floor(Date.now() / 1000) + 2 * 60,
    });

    console.log("PAYMENT RESPONSE:", payment);

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

// exports.handleWebhook = async (req, res) => {
//   const { code, data, signature } = req.body;

//   const isValid = payos.verifyPaymentWebhookData(req.body);
//   if (!isValid) return res.status(400).send("Invalid checksum");

//   if (code === "00" && data?.orderCode && data?.amount) {
//     const chiTietDatVe = await orderModel.getChiTietDatVeById(data.orderCode);

//     await orderModel.updateOrderCompleted(data.orderCode, {
//       trangThai: 1,
//       thoiGianThanhToan: new Date()
//         .toISOString()
//         .slice(0, 19)
//         .replace("T", " "),
//       phuongThucThanhToan: "PAYOS",
//       chiTietDatVe,
//     });

//     console.log(`✅ Đã thanh toán đơn hàng ${data.orderCode}`);
//   }

//   res.sendStatus(200);
// };

exports.handleWebhook = async (req, res) => {
  const { code, data } = req.body;

  const isValid = payos.verifyPaymentWebhookData(req.body);
  if (!isValid) return res.status(400).send("Invalid checksum");

  if (code === "00" && data?.orderCode && data?.amount) {
    try {
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

      console.log(
        `✅ Đã thanh toán đơn hàng ${data.orderCode} lúc ${thoiGianThanhToan}`
      );
    } catch (err) {
      console.error("Lỗi khi xử lý webhook:", err);
      return res.sendStatus(500);
    }
  }

  res.sendStatus(200);
};
