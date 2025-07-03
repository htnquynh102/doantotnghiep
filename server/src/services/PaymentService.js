const { payos } = require("../utils/payos");

exports.createPayment = async (maDonDatVe, tongTien) => {
  const payment = await payos.createPaymentLink({
    orderCode: maDonDatVe,
    amount: tongTien,
    description: `Thanh toán đơn vé #${maDonDatVe}`,
    returnUrl: `http://localhost:5173/payment-result/${maDonDatVe}`,
    expiredAt: Math.floor(Date.now() / 1000) + 15 * 60,
  });

  return {
    checkoutUrl: payment.checkoutUrl,
    qrCode: payment.qrCode,
  };
};
