const db = require("../database");

exports.findNotificationByUser = async (maTaiKhoan) => {
  const [data] = await db.query(
    `SELECT * FROM thongBao WHERE maTaiKhoan = ? order by thoiGianGui DESC`,
    [maTaiKhoan]
  );

  return data;
};

exports.createNotification = async (maTaiKhoan, tieuDe, noiDung) => {
  const [data] = await db.query(
    `insert into thongBao (maTaiKhoan, tieuDe, noiDung)  VALUES (?, ?, ?)`,
    [maTaiKhoan, tieuDe, noiDung]
  );
  return data;
};

exports.updateAsRead = async (maTaiKhoan) => {
  const [data] = await db.query(
    "UPDATE thongBao SET daDoc = 1 where maTaiKhoan = ?",
    [maTaiKhoan]
  );
  return data;
};
