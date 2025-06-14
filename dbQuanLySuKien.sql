drop database if exists dbQuanLySuKien;
create database dbQuanLySuKien CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
use dbQuanLySuKien;

create table TINHTHANH (
	maTinhThanh char(8) primary key,
    tenTinhThanh varchar(50) not null
) engine=InnoDB default charset=utf8mb4;

create table QUANHUYEN (
	maQuanHuyen char(8) primary key,
    tenQuanHuyen varchar(50) not null,
    maTinhThanh char(8) not null,
    foreign key (maTinhThanh) references TINHTHANH(maTinhThanh) on update cascade on delete cascade
) engine=InnoDB default charset=utf8mb4;

create table PHUONGXA (
	maPhuongXa char(8) primary key,
    tenPhuongXa varchar(50) not null,
    maQuanHuyen char(8) not null,
    foreign key (maQuanHuyen) references QUANHUYEN(maQuanHuyen) on update cascade on delete cascade
) engine=InnoDB default charset=utf8mb4;

create table VAITRO (
	maVaiTro char(8) primary key,
    tenVaiTro varchar(50) not null
) engine=InnoDB default charset=utf8mb4;

create table TAIKHOAN (
	maTaiKhoan char(8) primary key,
    maVaiTro char(8) not null,
    email varchar(50) unique not null,
    matKhau varchar(255) check (char_length(matKhau) >= 8),  
    ngayTao datetime default current_timestamp not null,
    anhDaiDien varchar(255),
    trangThai int check (trangThai in(-1,0,1)) not null ,
    foreign key (maVaiTro) references VAITRO(maVaiTro) on update cascade on delete cascade
) engine=InnoDB default charset=utf8mb4;

create table NGUOITHAMGIA (
	maNguoiThamGia char(8) primary key,
    maTaiKhoan char(8) not null unique,
    tenNguoiThamGia varchar(100),
    soDienThoai varchar(11),
    ngaySinh date,
    gioiTinh int check( gioiTinh in(0,1)),
    diaChi varchar(50),
    maPhuongXa char(8),
    foreign key (maTaiKhoan) references TAIKHOAN(maTaiKhoan) on update cascade on delete cascade, 
    foreign key (maPhuongXa) references PHUONGXA(maPhuongXa) on update cascade on delete cascade
) engine=InnoDB default charset=utf8mb4;

create table NHANVIEN (
	maNhanVien char(8) primary key,
    maTaiKhoan char(8) not null unique,
    tenNhanVien varchar(100),
    soDienThoai varchar(11),
    foreign key (maTaiKhoan) references TAIKHOAN(maTaiKhoan) on update cascade on delete cascade
) engine=InnoDB default charset=utf8mb4;


create table CTYSUKIEN (
	maCTySuKien char(8) primary key,
    maTaiKhoan char(8) not null unique,
    tenCongTy varchar(100),
    soDienThoai char(10),
    diaChiCongTy varchar(50),
    maPhuongXa char(8),
    giayPhepKinhDoanh varchar(255),
    chuTaiKhoanThanhToan varchar(100),
    soTaiKhoan varchar(14),
    tenNganHang varchar(100),
    chiNhanhNganHang varchar(100),
    trangThaiDuyet int check( trangThaiDuyet in(0,1,2)),
	foreign key (maTaiKhoan) references TAIKHOAN(maTaiKhoan) on update cascade on delete cascade,
    foreign key (maPhuongXa) references PHUONGXA(maPhuongXa) on update cascade on delete cascade
) engine=InnoDB default charset=utf8mb4;

create table DANHMUCSUKIEN (
	maDanhMuc char(8) primary key,
    tenDanhMuc varchar(50) not null,
    moTa text,
    trangThai int not null check( trangThai in (0,1,2)) default 1,
    maCTySuKien char(8) ,
    foreign key (maCTySuKien) references CTYSUKIEN(maCTySuKien) on delete set null 
) engine=InnoDB default charset=utf8mb4;

create table SUKIEN (
	maSuKien char(8) primary key,
    maDanhMuc char(8) not null,
    maCTySuKien char(8) not null,
    tenSuKien varchar(100) not null,
    ngayDangKy DATETIME DEFAULT CURRENT_TIMESTAMP,
    thoiGianMoBanVe datetime not null,
    thoiGianNgungBanVe datetime not null,
    diaDiemToChuc varchar(50) not null,
    soNhaDuong varchar(50),
    maPhuongXa char(8) not null,
    moTa text not null,
    trangThaiDuyet int not null check(trangThaiDuyet in (0, 1, 2)) default 0,
    anhBia varchar(255) not null,
    soVeMuaToiDa int not null CHECK (soVeMuaToiDa > 0),
	foreign key(maDanhMuc) references DANHMUCSUKIEN(maDanhMuc) on update cascade on delete cascade,
    foreign key(maCTySuKien) references CTYSUKIEN(maCTySuKien) on update cascade on delete cascade,
    foreign key(maPhuongXa) references PHUONGXA(maPhuongXa) on update cascade on delete cascade
) engine=InnoDB default charset=utf8mb4;

create table MINHCHUNGSUKIEN (
	maMinhChung char(8) primary key,
    maSuKien char(8) not null,
    tepDinhKem varchar(500) not null,
    foreign key (maSuKien) references SUKIEN(maSuKien) on update cascade on delete cascade
) engine=InnoDB default charset=utf8mb4;

create table CTRINHSUKIEN (
	maChuongTrinh char(8) primary key,
    maSuKien char(8) not null,
    thoiGianBatDau datetime not null,
    thoiGianKetThuc datetime not null,
    foreign key (maSuKien) references SUKIEN(maSuKien) on update cascade on delete cascade
) engine=InnoDB default charset=utf8mb4;

create table LOAIVE (
	maLoaiVe char(8) primary key,
    maChuongTrinh char(8) not null,
    tenLoaiVe varchar(50) not null,
    soLuong int not null check(soLuong > 0),
    giaBan decimal(10,0) not null,
    foreign key (maChuongTrinh) references CTRINHSUKIEN(maChuongTrinh) on update cascade on delete cascade
) engine=InnoDB default charset=utf8mb4;

create table DONDATVE (
	maDonDatVe char(8) primary key,
    maNguoiThamGia char(8) not null,
    thoiGianDatVe datetime not null default current_timestamp,
    thoiGianThanhToan datetime,
    trangThai int not null check ( trangThai in (0,1,2)),
    phuongThucThanhToan varchar(100),
    foreign key (maNguoiThamGia) references NGUOITHAMGIA(maNguoiThamGia) on update cascade on delete cascade
) engine=InnoDB default charset=utf8mb4;

create table CHITIETDATVE (
	maChiTietDatVe char(8) primary key,
    maDonDatVe char(8) not null,
    maLoaiVe char(8) not null,
    soLuongDat int not null,
    foreign key (maDonDatVe) references DONDATVE(maDonDatVe) on update cascade on delete cascade,
    foreign key (maLoaiVe) references LOAIVE(maLoaiVe) on update cascade on delete cascade
) engine=InnoDB default charset=utf8mb4;

CREATE TABLE VEBAN (
    maVe char(8) primary key,
    maChiTietDatVe char(8) not null,
    maQR text not null,
    thoiGianQuet datetime default NULL, -- Nếu chưa quét, sẽ là NULL
    trangThaiVe int not null check (trangThaiVe IN (0,1)), 
    viTri INT,
    foreign key (maChiTietDatVe) references CHITIETDATVE(maChiTietDatVe) on update cascade on delete cascade
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Trigger kiểm tra định dạng email
delimiter $$
create trigger check_email_insert
before insert on TAIKHOAN
for each row 
begin
    if new.email not regexp '^[A-Za-z0-9]+([._-][A-Za-z0-9]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)+$' THEN
        signal sqlstate '45000' set message_text = 'Email không hợp lệ';
    end if;
    if new.email regexp '\\.\\.' then
        signal sqlstate '45000' set message_text = 'Email không hợp lệ';
    end if;
end $$
delimiter ;

delimiter $$
create trigger check_email_update
before update on TAIKHOAN
for each row 
begin
    if new.email not regexp '^[A-Za-z0-9]+([._-][A-Za-z0-9]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)+$' THEN
        signal sqlstate '45000' set message_text = 'Email không hợp lệ';
    end if;
    if new.email regexp '\\.\\.' then
        signal sqlstate '45000' set message_text = 'Email không hợp lệ';
    end if;
end $$
delimiter ;

-- Trigger kiểm tra định dạng số điện thoại
delimiter $$
create trigger check_soDienThoai_nguoiThamGia_insert
before insert on NGUOITHAMGIA
for each row 
begin
    if new.soDienThoai not regexp '^[0-9]+$' then
        signal sqlstate '45000' set message_text = 'Số điện thoại không hợp lệ';
    end if;
end $$
delimiter ;

delimiter $$
create trigger check_soDienThoai_nguoiThamGia_update
before update on NGUOITHAMGIA
for each row 
begin
    if new.soDienThoai not regexp '^[0-9]+$' then
        signal sqlstate '45000' set message_text = 'Số điện thoại không hợp lệ';
    end if;
end $$
delimiter ;

delimiter $$
create trigger check_soDienThoai_cTySuKien_insert
before insert on CTYSUKIEN
for each row 
begin
    if new.soDienThoai not regexp '^[0-9]+$' then
        signal sqlstate '45000' set message_text = 'Số điện thoại không hợp lệ';
    end if;
end $$
delimiter ;

delimiter $$
create trigger check_soDienThoai_cTySuKien_update
before update on CTYSUKIEN
for each row 
begin
    if new.soDienThoai not regexp '^[0-9]+$' then
        signal sqlstate '45000' set message_text = 'Số điện thoại không hợp lệ';
    end if;
end $$
delimiter ;

-- Trigger kiểm tra định dạng số tài khoản ngân hàng
delimiter $$
create trigger check_soTaiKhoan_insert
before insert on CTYSUKIEN
for each row 
begin
    -- Kiểm tra số tài khoản chỉ chứa các ký tự số và có độ dài từ 10 đến 14
    if new.soTaiKhoan not regexp '^[0-9]{10,14}$' then
        signal sqlstate '45000'
        set message_text = 'Số tài khoản ngân hàng không hợp lệ';
    end if;
end $$;
delimiter ;

delimiter $$
create trigger check_soTaiKhoan_update
before update on CTYSUKIEN
for each row 
begin
    -- Kiểm tra số tài khoản chỉ chứa các ký tự số và có độ dài từ 10 đến 14
    if new.soTaiKhoan not regexp '^[0-9]{10,14}$' then
        signal sqlstate '45000'
        set message_text = 'Số tài khoản ngân hàng không hợp lệ';
    end if;
end $$;
delimiter ;

-- Trigger kiểm tra thời gian bán vé
delimiter $$
create trigger check_thoiGianBanVe_insert
before insert on SUKIEN
for each row 
begin
    if new.thoiGianMoBanVe > new.thoiGianNgungBanVe then
        signal sqlstate '45000' set message_text = 'Thời gian mở bán vé phải nhỏ hơn thời gian ngừng bán vé';
    end if;
end $$
delimiter ;

delimiter $$
create trigger check_thoiGianBanVe_update
before update on SUKIEN
for each row 
begin
    if new.thoiGianMoBanVe > new.thoiGianNgungBanVe then
        signal sqlstate '45000' set message_text = 'Thời gian mở bán vé phải nhỏ hơn thời gian ngừng bán vé';
    end if;
end $$
delimiter ;

-- Trigger kiểm tra thời gian diễn ra chương trình sự kiện
delimiter $$
create trigger check_thoiGianChuongTrinh_insert
before insert on CTRINHSUKIEN
for each row 
begin
    declare thoiGianNgungBanVe datetime;

    select thoiGianNgungBanVe
    into thoiGianNgungBanVe
    from SUKIEN
    where maSuKien = new.maSuKien;

    if new.thoiGianBatDau < thoiGianNgungBanVe then
        signal sqlstate '45000'
        set message_text = 'Thời gian bắt đầu chương trình phải sau thời gian bán vé của sự kiện';
    end if;
    
     if new.thoiGianBatDau > new.thoiGianKetThuc then
        signal sqlstate '45000'
        set message_text = 'Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc';
    end if;
end $$
delimiter ;

delimiter $$
create trigger check_thoiGianChuongTrinh_update
before update on CTRINHSUKIEN
for each row 
begin
    declare thoiGianNgungBanVe datetime;

    select thoiGianNgungBanVe
    into thoiGianNgungBanVe
    from SUKIEN
    where maSuKien = new.maSuKien;

    if new.thoiGianBatDau < thoiGianNgungBanVe then
        signal sqlstate '45000'
        set message_text = 'Thời gian bắt đầu chương trình phải sau thời gian bán vé của sự kiện';
    end if;
    
     if new.thoiGianBatDau > new.thoiGianKetThuc then
        signal sqlstate '45000'
        set message_text = 'Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc';
    end if;
end $$
delimiter ;

-- Trigger khóa chính tự động tăng
delimiter $$
create trigger before_insert_tinhThanh
before insert on TINHTHANH
for each row
begin
    declare stt int;
    declare maTuSinh char(8);

    select coalesce(max(cast(substring(maTinhThanh, 3) as unsigned)), 0) + 1 into stt
    from TINHTHANH;

    set maTuSinh = concat('TT', lpad(stt, 6, '0'));

    set new.maTinhThanh = maTuSinh;
end$$
delimiter ;

delimiter $$
create trigger before_insert_quanHuyen
before insert on QUANHUYEN
for each row
begin
    declare stt int;
    declare maTuSinh char(8);

    select coalesce(max(cast(substring(maQuanHuyen, 3) as unsigned)), 0) + 1 into stt
    from QUANHUYEN;

    set maTuSinh = concat('QH', lpad(stt, 6, '0'));

    set new.maQuanHuyen = maTuSinh;
end$$
delimiter ;

delimiter $$
create trigger before_insert_phuongXa
before insert on PHUONGXA
for each row
begin
    declare stt int;
    declare maTuSinh char(8);

    select coalesce(max(cast(substring(maPhuongXa, 3) as unsigned)), 0) + 1 into stt
    from PHUONGXA;

    set maTuSinh = concat('PX', lpad(stt, 6, '0'));

    set new.maPhuongXa = maTuSinh;
end$$
delimiter ;

delimiter $$
create trigger before_insert_vaiTro
before insert on VAITRO
for each row
begin
    declare stt int;
    declare maTuSinh char(8);

    select coalesce(max(cast(substring(maVaiTro, 3) as unsigned)), 0) + 1 into stt
    from VAITRO;

    set maTuSinh = concat('VT', lpad(stt, 6, '0'));

    set new.maVaiTro = maTuSinh;
end$$
delimiter ;

delimiter $$
create trigger before_insert_taiKhoan
before insert on TAIKHOAN
for each row
begin
    declare stt int;
    declare maTuSinh char(8);

    select coalesce(max(cast(substring(maTaiKhoan, 3) as unsigned)), 0) + 1 into stt
    from TAIKHOAN;

    set maTuSinh = concat('TK', lpad(stt, 6, '0'));

    set new.maTaiKhoan = maTuSinh;
end$$
delimiter ;

delimiter $$
create trigger before_insert_nguoiThamGia
before insert on NGUOITHAMGIA
for each row
begin
    declare stt int;
    declare maTuSinh char(8);

    select coalesce(max(cast(substring(maNguoiThamGia, 3) as unsigned)), 0) + 1 into stt
    from NGUOITHAMGIA;

    set maTuSinh = concat('TG', lpad(stt, 6, '0'));

    set new.maNguoiThamGia = maTuSinh;
end$$
delimiter ;

delimiter $$
create trigger before_insert_nhanVien
before insert on NHANVIEN
for each row
begin
    declare stt int;
    declare maTuSinh char(8);

    select coalesce(max(cast(substring(maNhanVien, 3) as unsigned)), 0) + 1 into stt
    from NHANVIEN;

    set maTuSinh = concat('TG', lpad(stt, 6, '0'));

    set new.maNhanVien = maTuSinh;
end$$
delimiter ;



delimiter $$
create trigger before_insert_cTySuKien
before insert on CTYSUKIEN
for each row
begin
    declare stt int;
    declare maTuSinh char(8);

    select coalesce(max(cast(substring(maCTySuKien, 3) as unsigned)), 0) + 1 into stt
    from CTYSUKIEN;

    set maTuSinh = concat('CT', lpad(stt, 6, '0'));

    set new.maCTySuKien = maTuSinh;
end$$
delimiter ;


delimiter $$
create trigger before_insert_danhMuc
before insert on DANHMUCSUKIEN
for each row
begin
    declare stt int;
    declare maTuSinh char(8);

    select coalesce(max(cast(substring(maDanhMuc, 3) as unsigned)), 0) + 1 into stt
    from DANHMUCSUKIEN;

    set maTuSinh = concat('DM', lpad(stt, 6, '0'));

    set new.maDanhMuc = maTuSinh;
end$$
delimiter ;

delimiter $$
create trigger before_insert_suKien
before insert on SUKIEN
for each row
begin
    declare stt int;
    declare maTuSinh char(8);

    select coalesce(max(cast(substring(maSuKien, 3) as unsigned)), 0) + 1 into stt
    from SUKIEN;

    set maTuSinh = concat('SK', lpad(stt, 6, '0'));

    set new.maSuKien = maTuSinh;
end$$
delimiter ;

delimiter $$
create trigger before_insert_chuongTrinh
before insert on CTRINHSUKIEN
for each row
begin
    declare stt int;
    declare maTuSinh char(8);

    select coalesce(max(cast(substring(maChuongTrinh, 3) as unsigned)), 0) + 1 into stt
    from CTRINHSUKIEN;

    set maTuSinh = concat('CT', lpad(stt, 6, '0'));

    set new.maChuongTrinh = maTuSinh;
end$$
delimiter ;

delimiter $$
create trigger before_insert_minhChung
before insert on MINHCHUNGSUKIEN
for each row
begin
    declare stt int;
    declare maTuSinh char(8);

    select coalesce(max(cast(substring(maMinhChung, 3) as unsigned)), 0) + 1 into stt
    from MINHCHUNGSUKIEN;

    set maTuSinh = concat('MC', lpad(stt, 6, '0'));

    set new.maMinhChung = maTuSinh;
end$$
delimiter ;

delimiter $$
create trigger before_insert_loaiVe
before insert on LOAIVE
for each row
begin
    declare stt int;
    declare maTuSinh char(8);

    select coalesce(max(cast(substring(maLoaiVe, 3) as unsigned)), 0) + 1 into stt
    from LOAIVE;

    set maTuSinh = concat('VE', lpad(stt, 6, '0'));

    set new.maLoaiVe = maTuSinh;
end$$
delimiter ;

delimiter $$
create trigger before_insert_donDatVe
before insert on DONDATVE
for each row
begin
    declare stt int;
    declare maTuSinh char(8);

    select coalesce(max(cast(substring(maDonDatVe, 3) as unsigned)), 0) + 1 into stt
    from DONDATVE;

    set maTuSinh = concat('DD', lpad(stt, 6, '0'));

    set new.maDonDatVe = maTuSinh;
end$$
delimiter ;

delimiter $$
create trigger before_insert_chiTietDatVe
before insert on CHITIETDATVE
for each row
begin
    declare stt int;
    declare maTuSinh char(8);

    select coalesce(max(cast(substring(maChiTietDatVe, 3) as unsigned)), 0) + 1 into stt
    from CHITIETDATVE;

    set maTuSinh = concat('CD', lpad(stt, 6, '0'));

    set new.maChiTietDatVe = maTuSinh;
end$$
delimiter ;

delimiter $$
create trigger before_insert_veBan
before insert on VEBAN
for each row
begin
    declare stt int;
    declare maTuSinh char(8);

    select coalesce(max(cast(substring(maVe, 3) as unsigned)), 0) + 1 into stt
    from VEBAN;

    set maTuSinh = concat('VE', lpad(stt, 6, '0'));

    set new.maVe = maTuSinh;
end$$
delimiter ;




