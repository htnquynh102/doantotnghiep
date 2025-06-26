use dbquanlysukien;
 select * from danhmucsukien;
  select * from ctysukien;
 delete  from taikhoan where maTaiKhoan = "TK000105";
SELECT tk.*, cty.*, px.tenPhuongXa, qh.tenQuanHuyen, tt.tenTinhThanh FROM CTYSUKIEN cty JOIN TAIKHOAN tk ON cty.maTaiKhoan = tk.maTaiKhoan LEFT JOIN PHUONGXA px ON cty.maPhuongXa = px.maPhuongXa LEFT JOIN QUANHUYEN qh ON px.maQuanHuyen = qh.maQuanHuyen LEFT JOIN TINHTHANH tt ON qh.maTinhThanh = tt.maTinhThanh WHERE cty.maTaiKhoan = "TK000037";

update SUKIEN set trangThaiDuyet = 0 where maSuKien = "SK000025";

update SUKIEN set anhBia = "https://res.cloudinary.com/didbhtr9w/image/upload/v1747914140/users/avatars/concert_cd.png.png" where maSuKien = "SK000025";

select * from ctysukien ;

select * from nguoithamgia where maTaiKhoan = "TK000100";

update ctysukien set giayPhepKinhDoanh = "https://res.cloudinary.com/didbhtr9w/image/upload/v1747907996/documents/CamScanner%202025-03-12%2011.38.pdf.pdf" where maTaiKhoan = "TK000102";

select * from taikhoan;

select *from ctrinhsukien ;

SELECT tk.*, nv.* FROM NHANVIEN nv JOIN TAIKHOAN tk ON nv.maTaiKhoan = tk.maTaiKhoan     WHERE nv.maTaiKhoan = "TK000002";

update ctysukien set giayPhepKinhDoanh= "https://res.cloudinary.com/didbhtr9w/image/upload/v1747909757/documents/CamScanner%202025-03-12%2011.40.pdf.pdf" where maTaiKhoan= "TK000102";

select * from taikhoan where maTaiKhoan = "TK000041";

update TAIKHOAN set matKhau = "$2b$10$kjdeLHW.3haLNfcmWKs4ueEo62J4yS.9tAXNnQ7hJuRu0GvfSpGlS" where maTaiKhoan = "TK000007";

select * from SUKIEN where maCTySuKien = "CT000001";

update CTYSUKIEN set trangThaiDuyet = 2 where maCTySuKien = "CT000001";

ALTER TABLE minhchungsukien MODIFY tepDinhKem VARCHAR(500);

select * from taikhoan where email= "baobinh31012001@gmail.com";
delete  from taikhoan where email= "baobinh31012001@gmail.com";
select * from MINHCHUNGSUKIEN;

update taikhoan set matKhau= "$2b$10$oBWNOHmEAfyfYbC8dSCMHeB8rus1Pkm9Fvn4H/tSKDUaOiV6WSNHy" where email = "eventpro@mediacorp.vn";

select * from taikhoan;

select *from dondatve;

select *from chitietdatve;

select * from nguoithamgia where maTaiKhoan = "TK000102";

select * from loaive where maChuongTrinh="CT000031";

select * from veban where maChiTietDatVe = "CD000002";

select * from chitietdatve where maLoaiVe = "VE000079";

update dondatve set trangThai = 1, thoiGianThanhToan = "2025-06-06 23:05:00",  phuongthucthanhtoan = "tín dụng" where maDonDatVe = "DD000001";

select * from chitietdatve c join dondatve d on c.maDonDatVe = d.maDonDatVe where c.maLoaiVe= "VE000079" and d.trangThai = 1;

delete  from dondatve where maDonDatVe= "DD000001";
select * from loaive;

select * from ctrinhsukien where maChuongTrinh="CT000031";

select c.*, l.tenLoaiVe, l.giaBan from chitietdatve c join loaive l on c.maLoaiVe = l.maLoaiVe where maDonDatVe="DD000063";
select * from taikhoan;




insert into DONDATVE (maNguoiThamGia, thoiGianDatVe, trangThai, phuongThucThanhToan) values
('TG000001', '2024-08-01 10:00:00', 0, 'Chuyển khoản'),
('TG000002', '2024-08-02 12:00:00', 1, 'Thanh toán qua ví điện tử'),
('TG000003', '2024-08-03 14:00:00', 2, 'Thẻ tín dụng'),
('TG000004', '2024-08-04 15:00:00', 0, 'Chuyển khoản'),
('TG000005', '2024-08-05 16:00:00', 1, 'Thanh toán qua ví điện tử'),
('TG000006', '2024-08-06 17:00:00', 0, 'Thẻ tín dụng'),
('TG000007', '2024-08-07 18:00:00', 1, 'Chuyển khoản'),
('TG000008', '2024-08-08 19:00:00', 2, 'Thanh toán qua ví điện tử'),
('TG000009', '2024-08-09 20:00:00', 0, 'Chuyển khoản'),
('TG000010', '2024-08-10 09:00:00', 1, 'Thẻ tín dụng'),
('TG000011', '2024-08-11 11:00:00', 2, 'Thanh toán qua ví điện tử'),
('TG000012', '2024-08-12 12:00:00', 0, 'Chuyển khoản'),
('TG000013', '2024-08-13 13:00:00', 1, 'Thanh toán qua ví điện tử'),
('TG000014', '2024-08-14 14:00:00', 0, 'Thẻ tín dụng'),
('TG000015', '2024-08-15 15:00:00', 1, 'Chuyển khoản'),
('TG000016', '2024-08-16 16:00:00', 2, 'Thanh toán qua ví điện tử'),
('TG000017', '2024-08-17 17:00:00', 0, 'Chuyển khoản'),
('TG000018', '2024-08-18 18:00:00', 1, 'Thẻ tín dụng'),
('TG000019', '2024-08-19 19:00:00', 2, 'Thanh toán qua ví điện tử'),
('TG000020', '2024-08-20 20:00:00', 0, 'Chuyển khoản'),
('TG000021', '2024-08-21 09:00:00', 1, 'Thanh toán qua ví điện tử'),
('TG000022', '2024-08-22 10:00:00', 0, 'Chuyển khoản'),
('TG000023', '2024-08-23 11:00:00', 1, 'Thẻ tín dụng'),
('TG000024', '2024-08-24 12:00:00', 2, 'Thanh toán qua ví điện tử'),
('TG000025', '2024-08-25 13:00:00', 0, 'Chuyển khoản'),
('TG000026', '2024-08-26 14:00:00', 1, 'Thanh toán qua ví điện tử'),
('TG000027', '2024-08-27 15:00:00', 0, 'Thẻ tín dụng'),
('TG000028', '2024-08-28 16:00:00', 1, 'Chuyển khoản'),
('TG000029', '2024-08-29 17:00:00', 0, 'Thanh toán qua ví điện tử'),
('TG000030', '2024-08-30 18:00:00', 2, 'Thẻ tín dụng'),
('TG000031', '2024-08-31 19:00:00', 0, 'Chuyển khoản'),
('TG000032', '2024-09-01 20:00:00', 1, 'Thanh toán qua ví điện tử'),
('TG000033', '2024-09-02 09:00:00', 0, 'Thẻ tín dụng'),
('TG000034', '2024-09-03 10:00:00', 1, 'Chuyển khoản'),
('TG000035', '2024-09-04 11:00:00', 2, 'Thanh toán qua ví điện tử'),
('TG000036', '2024-09-05 12:00:00', 0, 'Chuyển khoản'),
('TG000037', '2024-09-06 13:00:00', 1, 'Thẻ tín dụng'),
('TG000038', '2024-09-07 14:00:00', 0, 'Thanh toán qua ví điện tử'),
('TG000039', '2024-09-08 15:00:00', 2, 'Chuyển khoản'),
('TG000040', '2024-09-09 16:00:00', 1, 'Thanh toán qua ví điện tử'),
('TG000041', '2024-09-10 17:00:00', 0, 'Chuyển khoản'),
('TG000042', '2024-09-11 18:00:00', 2, 'Thẻ tín dụng'),
('TG000043', '2024-09-12 19:00:00', 0, 'Thanh toán qua ví điện tử'),
('TG000044', '2024-09-13 20:00:00', 1, 'Chuyển khoản'),
('TG000045', '2024-09-14 09:00:00', 2, 'Thẻ tín dụng'),
('TG000046', '2024-09-15 10:00:00', 0, 'Thanh toán qua ví điện tử'),
('TG000047', '2024-09-16 11:00:00', 1, 'Chuyển khoản'),
('TG000048', '2024-09-17 12:00:00', 2, 'Thanh toán qua ví điện tử'),
('TG000049', '2024-09-18 13:00:00', 0, 'Chuyển khoản'),
('TG000050', '2024-09-19 14:00:00', 1, 'Thẻ tín dụng'),
('TG000051', '2024-09-20 15:00:00', 0, 'Thanh toán qua ví điện tử'),
('TG000052', '2024-09-21 16:00:00', 1, 'Chuyển khoản'),
('TG000053', '2024-09-22 17:00:00', 0, 'Thẻ tín dụng'),
('TG000054', '2024-09-23 18:00:00', 2, 'Thanh toán qua ví điện tử'),
('TG000055', '2024-09-24 19:00:00', 0, 'Chuyển khoản'),
('TG000056', '2024-09-25 20:00:00', 1, 'Thanh toán qua ví điện tử'),
('TG000057', '2024-09-26 09:00:00', 0, 'Chuyển khoản'),
('TG000058', '2024-09-27 10:00:00', 2, 'Thẻ tín dụng'),
('TG000059', '2024-09-28 11:00:00', 0, 'Thanh toán qua ví điện tử'),
('TG000060', '2024-09-29 12:00:00', 1, 'Chuyển khoản'),
('TG000061', '2024-09-30 13:00:00', 2, 'Thanh toán qua ví điện tử'),
('TG000062', '2024-10-01 14:00:00', 0, 'Thẻ tín dụng');

insert into CHITIETDATVE (maDonDatVe, maLoaiVe, soLuongDat) values
('DD000001', 'VE000001', 5),
('DD000001', 'VE000002', 3),
('DD000002', 'VE000003', 7),
('DD000002', 'VE000004', 4),
('DD000003', 'VE000005', 6),
('DD000003', 'VE000006', 2),
('DD000004', 'VE000007', 5),
('DD000004', 'VE000008', 8),
('DD000005', 'VE000009', 9),
('DD000005', 'VE000010', 4),
('DD000006', 'VE000011', 3),
('DD000006', 'VE000012', 6),
('DD000007', 'VE000013', 10),
('DD000007', 'VE000014', 3),
('DD000008', 'VE000015', 2),
('DD000008', 'VE000016', 4),
('DD000009', 'VE000017', 6),
('DD000009', 'VE000018', 5),
('DD000010', 'VE000019', 7),
('DD000010', 'VE000020', 9),
('DD000011', 'VE000021', 3),
('DD000011', 'VE000022', 5),
('DD000012', 'VE000023', 8),
('DD000012', 'VE000024', 4),
('DD000013', 'VE000025', 9),
('DD000013', 'VE000026', 2),
('DD000014', 'VE000027', 10),
('DD000014', 'VE000028', 6),
('DD000015', 'VE000029', 3),
('DD000015', 'VE000030', 7),
('DD000016', 'VE000031', 6),
('DD000016', 'VE000032', 5),
('DD000017', 'VE000033', 7),
('DD000017', 'VE000034', 3),
('DD000018', 'VE000035', 8),
('DD000018', 'VE000036', 2),
('DD000019', 'VE000037', 9),
('DD000019', 'VE000038', 4),
('DD000020', 'VE000039', 5),
('DD000020', 'VE000040', 8),
('DD000021', 'VE000041', 10),
('DD000021', 'VE000042', 2),
('DD000022', 'VE000043', 4),
('DD000022', 'VE000044', 6),
('DD000023', 'VE000045', 3),
('DD000023', 'VE000046', 7),
('DD000024', 'VE000047', 6),
('DD000024', 'VE000048', 5),
('DD000025', 'VE000049', 8),
('DD000025', 'VE000050', 3),
('DD000026', 'VE000051', 7),
('DD000026', 'VE000052', 4),
('DD000027', 'VE000053', 10),
('DD000027', 'VE000054', 6),
('DD000028', 'VE000055', 3),
('DD000028', 'VE000056', 5),
('DD000029', 'VE000057', 4),
('DD000029', 'VE000058', 6),
('DD000030', 'VE000059', 9),
('DD000030', 'VE000060', 2),
('DD000031', 'VE000061', 7),
('DD000031', 'VE000062', 8),
('DD000032', 'VE000063', 5),
('DD000032', 'VE000064', 10),
('DD000033', 'VE000065', 6),
('DD000033', 'VE000066', 3),
('DD000034', 'VE000067', 2),
('DD000034', 'VE000068', 5),
('DD000035', 'VE000069', 7),
('DD000035', 'VE000070', 3),
('DD000036', 'VE000071', 9),
('DD000036', 'VE000072', 5),
('DD000037', 'VE000073', 4),
('DD000037', 'VE000074', 8),
('DD000038', 'VE000075', 6),
('DD000038', 'VE000076', 2),
('DD000039', 'VE000077', 7),
('DD000039', 'VE000078', 9),
('DD000040', 'VE000079', 3),
('DD000040', 'VE000080', 8),
('DD000041', 'VE000081', 5),
('DD000041', 'VE000082', 4),
('DD000042', 'VE000083', 6),
('DD000042', 'VE000084', 10),
('DD000043', 'VE000085', 3),
('DD000043', 'VE000086', 9),
('DD000044', 'VE000087', 2),
('DD000044', 'VE000088', 7),
('DD000045', 'VE000089', 6),
('DD000045', 'VE000090', 5),
('DD000046', 'VE000091', 10),
('DD000046', 'VE000092', 4),
('DD000047', 'VE000093', 8),
('DD000047', 'VE000094', 3),
('DD000048', 'VE000095', 7),
('DD000048', 'VE000096', 9),
('DD000049', 'VE000097', 5),
('DD000049', 'VE000098', 4),
('DD000050', 'VE000099', 8),
('DD000050', 'VE000100', 6),
('DD000051', 'VE000101', 7),
('DD000051', 'VE000102', 3),
('DD000052', 'VE000103', 6),
('DD000052', 'VE000104', 5),
('DD000053', 'VE000105', 9),
('DD000053', 'VE000106', 2),
('DD000054', 'VE000107', 3),
('DD000054', 'VE000108', 7),
('DD000055', 'VE000109', 4),
('DD000055', 'VE000110', 6),
('DD000056', 'VE000111', 9),
('DD000056', 'VE000112', 5),
('DD000057', 'VE000113', 10),
('DD000057', 'VE000114', 3),
('DD000058', 'VE000115', 8),
('DD000058', 'VE000116', 7),
('DD000059', 'VE000117', 6);

