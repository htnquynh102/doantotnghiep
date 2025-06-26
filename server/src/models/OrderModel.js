const db = require("../database");
const QRCode = require("qrcode");
const { v4: uuidv4 } = require("uuid");

exports.insertOrder = async (orderData) => {
  const connection = await db.getConnection();

  try {
    await connection.query(
      `INSERT INTO DONDATVE ( maNguoiThamGia, trangThai)
      VALUES (?, 0)`,
      [orderData.maNguoiThamGia]
    );

    const [orderIdResult] = await connection.query(
      `SELECT maDonDatVe FROM DONDATVE WHERE maNguoiThamGia = ? ORDER BY thoiGianDatVe DESC LIMIT 1`,
      [orderData.maNguoiThamGia]
    );

    const maDonDatVe = orderIdResult[0]?.maDonDatVe;

    for (const item of orderData.chiTietDatVe) {
      await connection.query(
        `INSERT INTO CHITIETDATVE (maDonDatVe, maLoaiVe, soLuongDat)
         VALUES (?, ?, ?)`,
        [maDonDatVe, item.maLoaiVe, item.soLuongDat]
      );
    }

    await connection.commit();

    return {
      success: true,
      message: "Đặt vé thành công!",
      maDonDatVe,
    };
  } catch (error) {
    await connection.rollback();
    console.error("Lỗi khi đặt vé:", error);
    throw error;
  } finally {
    connection.release();
  }
};

exports.findOrdersByUser = async (userId) => {
  const connection = await db.getConnection();

  try {
    const [orders] = await connection.query(
      `SELECT d.maDonDatVe, d.thoiGianDatVe, d.thoiGianThanhToan,
        d.trangThai, d.phuongThucThanhToan,
        ctr.maChuongTrinh, ctr.maSuKien, ctr.thoiGianBatDau, ctr.thoiGianKetThuc,
        ct.maChiTietDatVe, ct.maLoaiVe, ct.soLuongDat, lv.tenLoaiVe, lv.giaBan,
        s.tenSuKien, s.anhBia, s.soNhaTenDuong, s.diaDiemToChuc, 
        px.tenPhuongXa, qh.tenQuanHuyen, tt.tenTinhThanh
      FROM DONDATVE d
      JOIN CHITIETDATVE ct ON d.maDonDatVe = ct.maDonDatVe
      JOIN LOAIVE lv ON ct.maLoaiVe = lv.maLoaiVe
      JOIN CTRINHSUKIEN ctr ON lv.maChuongTrinh = ctr.maChuongTrinh
      JOIN SUKIEN s ON ctr.maSuKien = s.maSuKien
      JOIN PHUONGXA px ON s.maPhuongXa = px.maPhuongXa
      JOIN QUANHUYEN qh ON px.maQuanHuyen = qh.maQuanHuyen
      JOIN TINHTHANH tt ON qh.maTinhThanh = tt.maTinhThanh
      WHERE d.maNguoiThamGia = ?
      ORDER BY d.thoiGianDatVe DESC`,
      [userId]
    );

    const groupedOrders = {};

    for (const row of orders) {
      if (!groupedOrders[row.maDonDatVe]) {
        groupedOrders[row.maDonDatVe] = {
          maDonDatVe: row.maDonDatVe,
          thoiGianDatVe: row.thoiGianDatVe,
          thoiGianThanhToan: row.thoiGianThanhToan,
          trangThai: row.trangThai,
          tenSuKien: row.tenSuKien,
          anhBia: row.anhBia,
          soNhaTenDuong: row.soNhaTenDuong,
          diaDiemToChuc: row.diaDiemToChuc,
          maChuongTrinh: row.maChuongTrinh,
          thoiGianBatDau: row.thoiGianBatDau,
          thoiGianKetThuc: row.thoiGianKetThuc,
          tenPhuongXa: row.tenPhuongXa,
          tenQuanHuyen: row.tenQuanHuyen,
          tenTinhThanh: row.tenTinhThanh,
          tongTien: 0,
        };
      }

      groupedOrders[row.maDonDatVe].tongTien += row.soLuongDat * row.giaBan;
    }

    return Object.values(groupedOrders).sort(
      (a, b) => new Date(b.thoiGianDatVe) - new Date(a.thoiGianDatVe)
    );
  } finally {
    connection.release();
  }
};

exports.findOrderById = async (orderId) => {
  const [order] = await db.query(
    `SELECT d.maDonDatVe, d.thoiGianDatVe, d.thoiGianThanhToan,
      d.trangThai, d.phuongThucThanhToan,
      ctr.maChuongTrinh, ctr.thoiGianBatDau, ctr.thoiGianKetThuc,
      s.maSuKien, s.tenSuKien, s.anhBia,
      ct.maChiTietDatVe, ct.maLoaiVe, lv.tenLoaiVe, lv.giaBan, ct.soLuongDat,
      vb.maVe, vb.maChiTietDatVe, vb.maQR, vb.thoiGianQuet, vb.trangThaiVe, vb.viTri
    FROM DONDATVE d
    JOIN CHITIETDATVE ct ON d.maDonDatVe = ct.maDonDatVe
    JOIN LOAIVE lv ON ct.maLoaiVe = lv.maLoaiVe
    JOIN CTRINHSUKIEN ctr ON lv.maChuongTrinh = ctr.maChuongTrinh
    JOIN SUKIEN s ON ctr.maSuKien = s.maSuKien
    LEFT JOIN VEBAN vb ON ct.maChiTietDatVe = vb.maChiTietDatVe
    WHERE d.maDonDatVe = ?`,
    [orderId]
  );

  return order;
};

exports.updateTicketOrder = async (orderId, ticketData) => {
  await db.query(`DELETE FROM CHITIETDATVE WHERE maDonDatVe = ?`, [orderId]);

  for (const ticket of ticketData) {
    await db.query(
      `INSERT INTO CHITIETDATVE (maDonDatVe, maLoaiVe, soLuongDat) VALUES (?, ?, ?)`,
      [orderId, ticket.maLoaiVe, ticket.soLuongDat]
    );
  }
};

//////////////////////////
exports.updateOrderCompleted = async (orderId, orderData) => {
  const connection = await db.getConnection();

  try {
    await connection.query(
      `UPDATE DONDATVE SET thoiGianThanhToan = ?, trangThai = 1, phuongThucThanhToan = ? WHERE maDonDatVe = ?`,
      [orderData.thoiGianThanhToan, orderData.phuongThucThanhToan, orderId]
    );

    for (const item of orderData.chiTietDatVe) {
      const [soldCountResult] = await connection.query(
        `SELECT SUM(soLuongDat) AS soLuongDaBan
        FROM CHITIETDATVE ct
        JOIN DONDATVE d ON ct.maDonDatVe = d.maDonDatVe
        WHERE maLoaiVe = ? AND d.trangThai = 1;`,
        [item.maLoaiVe]
      );

      const [detailIdResult] = await connection.query(
        `SELECT maChiTietDatVe FROM CHITIETDATVE WHERE maDonDatVe = ? AND maLoaiVe = ? ORDER BY maChiTietDatVe DESC LIMIT 1`,
        [orderId, item.maLoaiVe]
      );

      const maChiTietDatVe = detailIdResult[0]?.maChiTietDatVe;

      let viTriBatDau = soldCountResult[0]?.soLuongDaBan || 0;

      for (let i = 0; i < item.soLuongDat; i++) {
        const qrBase64 = await QRCode.toDataURL(`VE-${uuidv4()}`);
        const viTri = viTriBatDau + i + 1;

        await connection.query(
          `INSERT INTO VEBAN (maChiTietDatVe, maQR, trangThaiVe, viTri) VALUES (?, ?, ?, ?)`,
          [maChiTietDatVe, qrBase64, 0, viTri]
        );
      }
    }

    await connection.commit();

    return {
      success: true,
      message: "Đặt vé thành công!",
    };
  } catch (error) {
    await connection.rollback();
    console.error("Lỗi khi đặt vé:", error);
    throw error;
  } finally {
    connection.release();
  }
};

exports.updateOrderCanceled = async (orderId) => {
  await db.query(`UPDATE DONDATVE SET trangThai = 2 WHERE maDonDatVe = ?`, [
    orderId,
  ]);
};
