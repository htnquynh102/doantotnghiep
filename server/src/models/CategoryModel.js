const db = require("../database");

exports.findAllCategory = async () => {
  const [data] = await db.query(
    "SELECT d.*, c.tenCongTy FROM DANHMUCSUKIEN d LEFT JOIN CTYSUKIEN c ON d.maCTySuKien = c.maCTySuKien"
  );
  return data.reverse();
};

exports.findCategoryById = async (categoryId) => {
  const [data] = await db.query(
    `SELECT * FROM DANHMUCSUKIEN WHERE maDanhMuc = ?`,
    [categoryId]
  );

  return data;
};

exports.insertCategory = async (categoryData) => {
  const { tenDanhMuc, moTa, trangThai, maCTySuKien } = categoryData;

  try {
    const [data] = await db.query(
      `INSERT INTO DANHMUCSUKIEN (tenDanhMuc,moTa,trangThai, maCTySuKien )  VALUES (?, ?, ?, ?)`,
      [tenDanhMuc, moTa, trangThai, maCTySuKien]
    );
    return data;
  } catch (error) {
    throw new Error("Database insert error: " + error.message);
  }
};

exports.updateCategoryById = async (categoryId, categoryData) => {
  const { tenDanhMuc, moTa } = categoryData;

  try {
    const [data] = await db.query(
      `UPDATE DANHMUCSUKIEN SET tenDanhMuc = ?, moTa = ? WHERE maDanhMuc = ?`,
      [tenDanhMuc, moTa, categoryId]
    );

    return data;
  } catch (error) {
    throw new Error("Database update error: " + error.message);
  }
};

exports.updateStatus = async (categoryId, status) => {
  const [data] = await db.query(
    "UPDATE DANHMUCSUKIEN SET trangThai = ? WHERE maDanhMuc = ?",
    [status, categoryId]
  );
  return data;
};
