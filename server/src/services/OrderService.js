const orderModel = require("../models/OrderModel");

exports.placeOrder = async (orderData) => {
  return await orderModel.insertOrder(orderData);
};

exports.getOrdersByUser = async (userId) => {
  return await orderModel.findOrdersByUser(userId);
};

exports.getOrderById = async (orderId) => {
  const orders = await orderModel.findOrderById(orderId);

  if (!orders.length) {
    return { success: false, message: "Không tìm thấy đơn đặt vé!" };
  }

  const order = {
    maDonDatVe: orders[0].maDonDatVe,
    thoiGianDatVe: orders[0].thoiGianDatVe,
    thoiGianThanhToan: orders[0].thoiGianThanhToan,
    trangThai: orders[0].trangThai,
    phuongThucThanhToan: orders[0].phuongThucThanhToan,
    maChuongTrinh: orders[0].maChuongTrinh,
    thoiGianBatDau: orders[0].thoiGianBatDau,
    thoiGianKetThuc: orders[0].thoiGianKetThuc,
    maSuKien: orders[0].maSuKien,
    tenSuKien: orders[0].tenSuKien,
    anhBia: orders[0].anhBia,
    chiTietDatVe: [],
  };

  orders.forEach((row) => {
    let chiTiet = order.chiTietDatVe.find(
      (c) => c.maChiTietDatVe === row.maChiTietDatVe
    );
    if (!chiTiet) {
      chiTiet = {
        maChiTietDatVe: row.maChiTietDatVe,
        maLoaiVe: row.maLoaiVe,
        tenLoaiVe: row.tenLoaiVe,
        giaBan: row.giaBan,
        soLuongDat: row.soLuongDat,
        veBan: [],
      };
      order.chiTietDatVe.push(chiTiet);
    }

    chiTiet.veBan.push({
      maVe: row.maVe,
      maChiTietDatVe: row.maChiTietDatVe,
      maQR: row.maQR,
      thoiGianQuet: row.thoiGianQuet,
      trangThaiVe: row.trangThaiVe,
      viTri: row.viTri,
    });
  });

  return order;
};

exports.updateTicketOrder = async (orderId, ticketData) => {
  return await orderModel.updateTicketOrder(orderId, ticketData);
};

exports.updateOrderCompleted = async (orderId, orderData) => {
  return await orderModel.updateOrderCompleted(orderId, orderData);
};
