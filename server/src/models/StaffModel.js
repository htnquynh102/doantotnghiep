const db = require("../database");

exports.findStaffById = async (accountId) => {
  const [data] = await db.query(
    `SELECT tk.*, nv.* FROM NHANVIEN nv JOIN TAIKHOAN tk ON nv.maTaiKhoan = tk.maTaiKhoan 
    WHERE nv.maTaiKhoan = ?`,
    [accountId]
  );

  return data;
};

exports.updateStaffById = async (accountId, staffData) => {
  const { tenNhanVien, soDienThoai, anhDaiDien } = staffData;
  const connection = await db.getConnection();

  if (anhDaiDien) {
    await connection.query(
      `UPDATE TAIKHOAN SET anhDaiDien = ? WHERE maTaiKhoan = ?`,
      [anhDaiDien, accountId]
    );
  }

  await connection.query(
    `UPDATE NHANVIEN 
     SET tenNhanVien = ?, soDienThoai = ?
     WHERE maTaiKhoan = ?`,
    [tenNhanVien, soDienThoai?.trim() === "" ? null : soDienThoai, accountId]
  );
};
