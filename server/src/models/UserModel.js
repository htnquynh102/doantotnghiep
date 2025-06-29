const db = require("../database");

exports.findAllUser = async () => {
  const [data] = await db.query(
    `SELECT tk.*, ntg.*, 
    px.tenPhuongXa, qh.tenQuanHuyen, tt.tenTinhThanh,
     COUNT(ddv.maNguoiThamGia) AS soLuotDatVe
    FROM NGUOITHAMGIA ntg JOIN TAIKHOAN tk ON ntg.maTaiKhoan = tk.maTaiKhoan 
    LEFT JOIN PHUONGXA px ON ntg.maPhuongXa = px.maPhuongXa 
    LEFT JOIN QUANHUYEN qh ON px.maQuanHuyen = qh.maQuanHuyen 
    LEFT JOIN TINHTHANH tt ON qh.maTinhThanh = tt.maTinhThanh 
    LEFT JOIN DONDATVE ddv ON ntg.maNguoiThamGia = ddv.maNguoiThamGia
    GROUP BY ntg.maNguoiThamGia
    ORDER BY ntg.maNguoiThamGia DESC;`
  );

  return data;
};

exports.findUserById = async (accountId) => {
  const [data] = await db.query(
    `SELECT tk.*, ntg.*, px.tenPhuongXa, qh.tenQuanHuyen, tt.tenTinhThanh FROM NGUOITHAMGIA ntg JOIN TAIKHOAN tk ON ntg.maTaiKhoan = tk.maTaiKhoan LEFT JOIN PHUONGXA px ON ntg.maPhuongXa = px.maPhuongXa LEFT JOIN QUANHUYEN qh ON px.maQuanHuyen = qh.maQuanHuyen LEFT JOIN TINHTHANH tt ON qh.maTinhThanh = tt.maTinhThanh WHERE ntg.maTaiKhoan = ?`,
    [accountId]
  );

  return data;
};

exports.updateUserById = async (accountId, userData) => {
  const {
    tenNguoiThamGia,
    soDienThoai,
    ngaySinh,
    gioiTinh,
    diaChi,
    maPhuongXa,
    anhDaiDien,
  } = userData;

  const connection = await db.getConnection();

  try {
    if (anhDaiDien) {
      await connection.query(
        `UPDATE TAIKHOAN SET anhDaiDien = ? WHERE maTaiKhoan = ?`,
        [anhDaiDien, accountId]
      );
    }

    await connection.query(
      `UPDATE NGUOITHAMGIA 
       SET tenNguoiThamGia = ?, soDienThoai = ?, ngaySinh = ?, gioiTinh = ?, diaChi = ?, maPhuongXa = ?
       WHERE maTaiKhoan = ?`,
      [
        tenNguoiThamGia,
        soDienThoai?.trim() === "" ? null : soDienThoai,
        ngaySinh?.trim() ? ngaySinh : null,
        isNaN(gioiTinh) || gioiTinh === "" ? null : parseInt(gioiTinh),
        diaChi,
        maPhuongXa?.trim() === "" ? null : maPhuongXa,
        accountId,
      ]
    );

    await connection.commit();

    return { success: true, message: "User updated successfully" };
  } catch (error) {
    await connection.rollback();
    throw new Error("Database update error: " + error.message);
  }
};
