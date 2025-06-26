const orderService = require("../services/OrderService");

const placeOrder = async (req, res) => {
  try {
    const result = await orderService.placeOrder(req.body);

    res.status(200).json({ success: true, message: "Đặt vé thành công" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Lỗi đặt vé", error: err.message });
  }
};

const getOrdersByUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const result = await orderService.getOrdersByUser(userId);

    res.status(200).json({
      success: true,
      message: "Lấy đơn đặt vé thành công",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const result = await orderService.getOrderById(orderId);

    res.status(200).json({
      success: true,
      message: "Lấy đơn đặt vé thành công",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

const updateTicketOrder = async (req, res) => {
  try {
    const { id: orderId, data: ticketData } = req.body;

    await orderService.updateTicketOrder(orderId, ticketData);

    res.status(200).json({ success: true, message: "Vé đã cập nhật!" });
  } catch (error) {
    console.error("Lỗi cập nhật vé:", error);
    res.status(500).json({ success: false, message: "Có lỗi xảy ra!" });
  }
};

const updateOrderCompleted = async (req, res) => {
  try {
    const { id: orderId, data: orderData } = req.body;
    console.log("id", orderId);
    console.log("order data", orderData.chiTietDatVe);

    if (!orderId || !orderData || !Array.isArray(orderData.chiTietDatVe)) {
      return res
        .status(400)
        .json({ success: false, message: "Dữ liệu không hợp lệ!" });
    }

    await orderService.updateOrderCompleted(orderId, orderData);
    res.status(200).json({ success: true, message: "Thanh toán thành công" });
  } catch (error) {
    console.error("Lỗi cập nhật đơn hàng:", error);
    res.status(500).json({ success: false, message: "Có lỗi xảy ra!" });
  }
};

const updateOrderCanceled = async (req, res) => {
  try {
    const { id: orderId } = req.body;

    if (!orderId) {
      return res
        .status(400)
        .json({ success: false, message: "Dữ liệu không hợp lệ!" });
    }

    await orderService.updateOrderCanceled(orderId);
    res.status(200).json({ success: true, message: "Hủy đơn này" });
  } catch (error) {
    console.error("Lỗi cập nhật đơn hàng:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

module.exports = {
  placeOrder,
  getOrdersByUser,
  getOrderById,
  updateTicketOrder,
  updateOrderCompleted,
  updateOrderCanceled,
};
