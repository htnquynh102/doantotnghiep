const db = require("../database");

exports.findAllOrganizer = async () => {
  const [data] = await db.query(
    `SELECT tk.*, cty.*, px.tenPhuongXa, qh.tenQuanHuyen, tt.tenTinhThanh 
        FROM CTYSUKIEN cty 
        JOIN TAIKHOAN tk ON cty.maTaiKhoan = tk.maTaiKhoan 
        LEFT JOIN PHUONGXA px ON cty.maPhuongXa = px.maPhuongXa 
        LEFT JOIN QUANHUYEN qh ON px.maQuanHuyen = qh.maQuanHuyen 
        LEFT JOIN TINHTHANH tt ON qh.maTinhThanh = tt.maTinhThanh 
        ORDER BY cty.maCTySuKien DESC`
  );

  return data;
};

exports.findOrganizerById = async (accountId) => {
  const [data] = await db.query(
    `SELECT tk.*, cty.*, px.tenPhuongXa, qh.tenQuanHuyen, tt.tenTinhThanh 
        FROM CTYSUKIEN cty JOIN TAIKHOAN tk ON cty.maTaiKhoan = tk.maTaiKhoan 
        LEFT JOIN PHUONGXA px ON cty.maPhuongXa = px.maPhuongXa 
        LEFT JOIN QUANHUYEN qh ON px.maQuanHuyen = qh.maQuanHuyen 
        LEFT JOIN TINHTHANH tt ON qh.maTinhThanh = tt.maTinhThanh 
        WHERE cty.maTaiKhoan = ?`,
    [accountId]
  );

  return data;
};

exports.updateOrganizerById = async (accountId, orgData) => {
  const {
    tenCongTy,
    soDienThoai,
    diaChiCongTy,
    maPhuongXa,
    giayPhepKinhDoanh,
    chuTaiKhoanThanhToan,
    soTaiKhoan,
    tenNganHang,
    chiNhanhNganHang,
    anhDaiDien,
    trangThaiDuyet,
  } = orgData;

  const connection = await db.getConnection();

  try {
    if (anhDaiDien) {
      await connection.query(
        `UPDATE TAIKHOAN SET anhDaiDien = ? WHERE maTaiKhoan = ?`,
        [anhDaiDien, accountId]
      );
    }

    if (giayPhepKinhDoanh) {
      await connection.query(
        `UPDATE CTYSUKIEN 
       SET  giayPhepKinhDoanh = ?
       WHERE maTaiKhoan = ?`,
        [giayPhepKinhDoanh, accountId]
      );
    }

    await connection.query(
      `UPDATE CTYSUKIEN 
       SET tenCongTy = ?, soDienThoai = ?, diaChiCongTy = ?, maPhuongXa = ?,chuTaiKhoanThanhToan = ?, soTaiKhoan = ?, tenNganHang = ?, chiNhanhNganHang =?, trangThaiDuyet =?
       WHERE maTaiKhoan = ?`,
      [
        tenCongTy,
        soDienThoai?.trim() === "" ? null : soDienThoai,
        diaChiCongTy,
        maPhuongXa?.trim() === "" ? null : maPhuongXa,
        chuTaiKhoanThanhToan,
        soTaiKhoan?.trim() === "" ? null : soDienThoai,
        tenNganHang,
        chiNhanhNganHang,
        trangThaiDuyet,
        accountId,
      ]
    );

    await connection.commit();

    return { success: true, message: "Organizer updated successfully" };
  } catch (error) {
    await connection.rollback();
    throw new Error("Database update error: " + error.message);
  }
};

exports.updateStatus = async (accountId, status) => {
  const [data] = await db.query(
    `UPDATE CTYSUKIEN SET trangThaiDuyet = ? WHERE maTaiKhoan = ?`,
    [status, accountId]
  );

  return data;
};
