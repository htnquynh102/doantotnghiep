const { payos } = require("./payos");
const dotenv = require("dotenv");
dotenv.config();

(async () => {
  try {
    const res = await payos.confirmWebhook(
      "https://64df-116-98-160-120.ngrok-free.app/api/webhook/payos"
    );
    console.log("✅ Webhook đã được đăng ký:", res);
  } catch (error) {
    console.error("❌ Lỗi khi đăng ký webhook:", error.message);
  }
})();
