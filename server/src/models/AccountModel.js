const db = require("../database");

exports.findAllAccounts = async () => {
  const [data] = await db.query(`
    SELECT t.maTaiKhoan, t.maVaiTro, t.email, t.ngayTao,t.trangThai, t.anhDaiDien,
      COALESCE(n.tenNguoiThamGia, c.tenCongTy) AS ten,
      COALESCE(n.soDienThoai, c.soDienThoai) AS soDienThoai
    FROM TAIKHOAN t
    LEFT JOIN NGUOITHAMGIA n ON t.maTaiKhoan = n.maTaiKhoan
    LEFT JOIN CTYSUKIEN c ON t.maTaiKhoan = c.maTaiKhoan
    WHERE t.maVaiTro != 'VT000001'
    ORDER BY t.ngayTao DESC;`);
  return data;
};

exports.insertAccount = async (accountData) => {
  const {
    maVaiTro,
    email,
    matKhau,
    anhDaiDien = null,
    trangThai,
  } = accountData;

  try {
    const [data] = await db.query(
      `INSERT INTO TAIKHOAN ( maVaiTro, email, matKhau, anhDaiDien, trangThai)  VALUES (?, ?, ?, ?, ?)`,
      [maVaiTro, email, matKhau, anhDaiDien, trangThai]
    );

    const [[account]] = await db.query(
      `SELECT maTaiKhoan FROM TAIKHOAN WHERE email = ?`,
      [email]
    );

    console.log("Mã tài khoản vừa tạo:", account.maTaiKhoan);

    if (maVaiTro === "VT000004") {
      await db.query(`INSERT INTO NGUOITHAMGIA (maTaiKhoan) VALUES (?)`, [
        account.maTaiKhoan,
      ]);
    }
    if (maVaiTro === "VT000003") {
      await db.query(`INSERT INTO CTYSUKIEN (maTaiKhoan) VALUES (?)`, [
        account.maTaiKhoan,
      ]);
    }

    if (maVaiTro === "VT000002") {
      await db.query(`INSERT INTO nhanvien (maTaiKhoan) VALUES (?)`, [
        account.maTaiKhoan,
      ]);
    }
    return data;
  } catch (error) {
    throw new Error("Database insert error: " + error.message);
  }
};

exports.updateStatusByEmail = async (email) => {
  const sql = "UPDATE TAIKHOAN SET trangThai = 1 WHERE email = ?";
  try {
    const [account] = await db.query(sql, [email]);
    return account;
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái tài khoản:", error);
    throw error;
  }
};

exports.findAccountByEmail = async (email) => {
  try {
    const [accounts] = await db.query(
      `SELECT * FROM TAIKHOAN WHERE email = ?`,
      [email]
    );

    if (!accounts || accounts.length === 0) {
      return null;
    }

    return accounts[0];
  } catch (error) {
    console.error("Lỗi khi truy vấn tài khoản:", error);
  }
};

exports.resetPassword = async (email, newPassword) => {
  try {
    await db.query(`UPDATE TAIKHOAN SET matKhau = ? WHERE email = ?`, [
      newPassword,
      email,
    ]);

    return { success: true, message: "Mật khẩu đã được cập nhật thành công!" };
  } catch (error) {
    console.error("Lỗi khi đặt lại mật khẩu:", error);
    throw new Error("Database error khi cập nhật mật khẩu");
  }
};

exports.updateStatus = async (accountId, status) => {
  const [data] = await db.query(
    `UPDATE TAIKHOAN SET trangThai = ? WHERE maTaiKhoan = ?`,
    [status, accountId]
  );
  return data;
};
