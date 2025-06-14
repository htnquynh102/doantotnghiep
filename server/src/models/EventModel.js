const db = require("../database");

exports.findAllEvent = async () => {
  const [data] = await db.query(`
    SELECT s.maSuKien, s.ngayDangKy, s.maDanhMuc, s.tenSuKien, s.soNhaDuong, s.diaDiemToChuc, s.anhBia, s.trangThaiDuyet,
            cty.tenCongTy, cty.maTaiKhoan,
            px.tenPhuongXa, qh.tenQuanHuyen, tt.tenTinhThanh,
            (SELECT ct.thoiGianBatDau 
             FROM CTRINHSUKIEN ct 
             WHERE ct.maSuKien = s.maSuKien 
             ORDER BY ct.thoiGianBatDau DESC 
             LIMIT 1) AS thoiGianBatDau,
            (SELECT MIN(lv.giaBan) 
             FROM LOAIVE lv 
             JOIN CTRINHSUKIEN ct ON lv.maChuongTrinh = ct.maChuongTrinh 
             WHERE ct.maSuKien = s.maSuKien) AS giaBanThapNhat
        FROM SUKIEN s
        JOIN CTYSUKIEN cty ON s.maCTySuKien = cty.maCTySuKien
        JOIN PHUONGXA px ON s.maPhuongXa = px.maPhuongXa
        JOIN QUANHUYEN qh ON px.maQuanHuyen = qh.maQuanHuyen
        JOIN TINHTHANH tt ON qh.maTinhThanh = tt.maTinhThanh
        ORDER BY s.ngayDangKy DESC
    `);
  return data;
};

exports.findLatestEvents = async () => {
  const [data] = await db.query(`
        SELECT s.maSuKien, s.ngayDangKy, s.tenSuKien, s.soNhaDuong, s.diaDiemToChuc, s.anhBia,
            px.tenPhuongXa, qh.tenQuanHuyen, tt.tenTinhThanh,
            (SELECT ct.thoiGianBatDau 
             FROM CTRINHSUKIEN ct 
             WHERE ct.maSuKien = s.maSuKien 
             ORDER BY ct.thoiGianBatDau DESC 
             LIMIT 1) AS thoiGianBatDau,
            (SELECT MIN(lv.giaBan) 
             FROM LOAIVE lv 
             JOIN CTRINHSUKIEN ct ON lv.maChuongTrinh = ct.maChuongTrinh 
             WHERE ct.maSuKien = s.maSuKien) AS giaBanThapNhat
        FROM SUKIEN s
        JOIN PHUONGXA px ON s.maPhuongXa = px.maPhuongXa
        JOIN QUANHUYEN qh ON px.maQuanHuyen = qh.maQuanHuyen
        JOIN TINHTHANH tt ON qh.maTinhThanh = tt.maTinhThanh
        WHERE s.trangThaiDuyet = 1
        ORDER BY s.ngayDangKy DESC
        LIMIT 6;
    `);

  return data;
};

exports.findEventById = async (eventId) => {
  const connection = await db.getConnection();

  try {
    const [event] = await connection.query(
      `SELECT s.*, dm.tenDanhMuc,
           px.tenPhuongXa, qh.tenQuanHuyen, tt.tenTinhThanh, cty.tenCongTy
    FROM SUKIEN s
    JOIN DANHMUCSUKIEN dm ON s.maDanhMuc = dm.maDanhMuc
    JOIN CTYSUKIEN cty ON s.maCTySuKien = cty.maCTySuKien
    JOIN PHUONGXA px ON s.maPhuongXa = px.maPhuongXa
    JOIN QUANHUYEN qh ON px.maQuanHuyen = qh.maQuanHuyen
    JOIN TINHTHANH tt ON qh.maTinhThanh = tt.maTinhThanh
    WHERE s.maSuKien = ?`,
      [eventId]
    );

    const [programs] = await connection.query(
      `SELECT * FROM CTRINHSUKIEN WHERE maSuKien = ?`,
      [eventId]
    );

    for (let i = 0; i < programs.length; i++) {
      const maChuongTrinh = programs[i].maChuongTrinh;

      const [tickets] = await connection.query(
        `SELECT lv.*, 
        COALESCE(lv.soLuong - SUM(CASE WHEN d.trangThai = 1 THEN ct.soLuongDat ELSE 0 END), lv.soLuong) AS soLuongConLai
        FROM LOAIVE lv
        LEFT JOIN CHITIETDATVE ct ON lv.maLoaiVe = ct.maLoaiVe
        LEFT JOIN DONDATVE d ON ct.maDonDatVe = d.maDonDatVe
        WHERE lv.maChuongTrinh = ?
        GROUP BY lv.maLoaiVe;`,
        [maChuongTrinh]
      );

      programs[i].loaiVe = tickets;
    }

    const [proofs] = await connection.query(
      `SELECT * FROM MINHCHUNGSUKIEN WHERE maSuKien = ?`,
      [eventId]
    );

    event[0].chuongtrinh = programs;
    event[0].minhChung = proofs;
    return event[0];
  } finally {
    connection.release();
  }
};

exports.updateStatus = async (eventId, status) => {
  const [data] = await db.query(
    `UPDATE SUKIEN SET trangThaiDuyet = ? WHERE maSuKien = ?`,
    [status, eventId]
  );

  return data;
};

exports.insertEvent = async (eventData) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const [eventResult] = await connection.query(
      `INSERT INTO SUKIEN (maDanhMuc, maCTySuKien, tenSuKien, thoiGianMoBanVe, thoiGianNgungBanVe, diaDiemToChuc, soNhaDuong, maPhuongXa, moTa, trangThaiDuyet, anhBia, soVeMuaToiDa) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        eventData.maDanhMuc,
        eventData.maCTySuKien,
        eventData.tenSuKien,
        eventData.thoiGianMoBanVe,
        eventData.thoiGianNgungBanVe,
        eventData.diaDiemToChuc,
        eventData.soNhaDuong,
        eventData.maPhuongXa,
        eventData.moTa,
        eventData.trangThaiDuyet,
        eventData.anhBia,
        eventData.soVeMuaToiDa,
      ]
    );

    const [eventId] = await connection.query(
      `SELECT maSuKien FROM SUKIEN WHERE maDanhMuc = ? AND tenSuKien = ? ORDER BY thoiGianMoBanVe DESC LIMIT 1`,
      [eventData.maDanhMuc, eventData.tenSuKien]
    );

    const maSuKien = eventId[0]?.maSuKien;

    for (const program of eventData.chuongTrinh) {
      const [programResult] = await connection.query(
        `INSERT INTO CTRINHSUKIEN (maSuKien, thoiGianBatDau, thoiGianKetThuc) VALUES (?, ?, ?)`,
        [maSuKien, program.thoiGianBatDau, program.thoiGianKetThuc]
      );

      const [programId] = await connection.query(
        `SELECT maChuongTrinh FROM CTRINHSUKIEN WHERE maSuKien = ? ORDER BY thoiGianBatDau DESC LIMIT 1`,
        [maSuKien]
      );

      const maChuongTrinh = programId[0]?.maChuongTrinh;

      for (const ticket of program.loaiVe) {
        await connection.query(
          `INSERT INTO LOAIVE (maChuongTrinh, tenLoaiVe, soLuong, giaBan) VALUES (?, ?, ?, ?)`,
          [maChuongTrinh, ticket.tenLoaiVe, ticket.soLuong, ticket.giaBan]
        );
      }
    }

    for (const proof of eventData.minhChung) {
      await connection.query(
        `INSERT INTO MINHCHUNGSUKIEN (maSuKien, tepDinhKem) VALUES (?, ?)`,
        [maSuKien, proof.tepDinhKem]
      );
    }

    await connection.commit();
    return {
      success: true,
      message: "Sự kiện đã được tạo thành công!",
      maSuKien,
    };
  } catch (error) {
    await connection.rollback();
    console.error("Lỗi khi tạo sự kiện:", error);
    throw error;
  } finally {
    connection.release();
  }
};

exports.updateEvent = async (eventId, eventData) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    if (eventData.anhBia) {
      await connection.query(
        `UPDATE SUKIEN SET anhBia = ? WHERE maSuKien = ?`,
        [anhBia, eventId]
      );
    }

    await connection.query(
      `UPDATE SUKIEN SET maDanhMuc = ?,  tenSuKien = ?, thoiGianMoBanVe = ?, thoiGianNgungBanVe = ?, diaDiemToChuc = ?, soNhaDuong = ?, maPhuongXa = ?, moTa = ?, trangThaiDuyet = ?, soVeMuaToiDa = ? WHERE maSuKien = ?`,
      [
        eventData.maDanhMuc,
        eventData.tenSuKien,
        eventData.thoiGianMoBanVe,
        eventData.thoiGianNgungBanVe,
        eventData.diaDiemToChuc,
        eventData.soNhaDuong,
        eventData.maPhuongXa,
        eventData.moTa,
        eventData.trangThaiDuyet,
        eventData.soVeMuaToiDa,
        eventId,
      ]
    );

    await connection.query(`DELETE FROM CTRINHSUKIEN WHERE maSuKien = ?`, [
      eventId,
    ]);

    for (const program of eventData.chuongTrinh) {
      const [programResult] = await connection.query(
        `INSERT INTO CTRINHSUKIEN (maSuKien, thoiGianBatDau, thoiGianKetThuc) VALUES (?, ?, ?)`,
        [eventId, program.thoiGianBatDau, program.thoiGianKetThuc]
      );

      const [programId] = await connection.query(
        `SELECT maChuongTrinh FROM CTRINHSUKIEN WHERE maSuKien = ? ORDER BY thoiGianBatDau DESC LIMIT 1`,
        [eventId]
      );
      const maChuongTrinh = programId[0]?.maChuongTrinh;

      for (const ticket of program.loaiVe) {
        await connection.query(
          `INSERT INTO LOAIVE (maChuongTrinh, tenLoaiVe, soLuong, giaBan) VALUES (?, ?, ?, ?)`,
          [maChuongTrinh, ticket.tenLoaiVe, ticket.soLuong, ticket.giaBan]
        );
      }
    }

    if (eventData.minhChung && eventData.minhChung.length > 0) {
      await connection.query(`DELETE FROM MINHCHUNGSUKIEN WHERE maSuKien = ?`, [
        eventId,
      ]);

      for (const proof of eventData.minhChung) {
        await connection.query(
          `INSERT INTO MINHCHUNGSUKIEN (maSuKien, tepDinhKem) VALUES (?, ?)`,
          [eventId, proof.tepDinhKem]
        );
      }
    }

    await connection.commit();
    return {
      success: true,
      message: "Sự kiện đã được cập nhật thành công!",
    };
  } catch (error) {
    await connection.rollback();
    console.error("Lỗi khi cập nhật sự kiện:", error);
    throw error;
  } finally {
    connection.release();
  }
};
