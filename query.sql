create database BuyHouse;
use BuyHouse;

create table tAdmin(
	adminId int not null auto_increment primary key ,
	accountAdmin varchar(20) not null,
    passwordAdmin varchar(20) not null
);

create table tUser(
	userId int not null auto_increment primary key,
    adminId int,
    nameUser  varchar(20),
    address varchar(50),
    phone varchar(20),
    passwordUR varchar(20),
    email varchar(70),
    cccd varchar(20),
    typeDK bit,
    dateDK date,
    constraint foreign key (adminId) references tAdmin(adminId)
);
alter table tUser
add column gender varchar(20);
-- title, lat-vi do, lng-kinh do, status - dang thue, cho thue (con phong)
create table Post(
	postId int not null auto_increment primary key,
    datePost date,
    address varchar(70),
    cost long,
    image text,
    descriptionPost text,
    userId int,
    
    constraint foreign key(userId) references tUser(userId)
);

insert tAdmin(accountAdmin,passwordAdmin) values
('admin','admin');
-- 1 la chu
-- 0 la thue


insert tUser(email,phone,passwordUR,typeDK,gender,address,cccd,nameUser) values
('linhninh2@gmail.com','0862861396','linh123',0,'nu','Huyện Đông Anh,thành phố Hà Nội','001302011253','Trần Mỹ Linh'),
('mintduc2612@gmail.com','0367218700','duc123',1,'nam','Phường Cẩm Sơn,thành phố Cẩm Phả,tỉnh Quảng Ninh','022202002528','Trần Minh Đức'),
('Minhanh190202@gmail.com','0978363413','minhanh123',1,'nam','Huyện Gia Lâm,thành phố Hà Nội','001302011234','Trần Minh Anh');
select * from Post;


insert Post(userId,datePost,address,cost,image,descriptionPost)
values (2,'2022-10-10','Láng Hạ - Đống Đa - Hà Nội',14000000,'https://cloud.muaban.net/images/2022/08/17/017/250a3395cd8c4df2bf7c5055a4e790ac.jpg','Cho thuê nhà tại phố Hoàng Ngọc Phách, Láng Hạ, quận Đống Đa, Hà Nội 
- Nhà tầng 1 mặt phố, diện tích 32m2.
- Mặt ngõ rộng ôtô rất thuận tiện cho mở văn phòng công ty, lớp học, spa.'),
(2,'2022-10-11','Thanh Nhàn - Hai Bà Trưng - Hà Nội',16000000,'https://cloud.muaban.net/images/2022/10/11/454/d4d5632e29504613b72ce3256b0532b1.jpg','Chính chủ cho thuê nhà đầu ngõ 281 Trần Khát Chân. Diện tích 55m2, nhà 4 tầng, 2 mặt thoáng, tất cả các phòng đều có cửa sổ. Vệ sinh khép kín mỗi tầng, nóng lạnh đầy đủ. 
Nhà đầu ngõ tiện ở kết hợp kinh doanh.'),
(2,'2019-10-21','Quán Thánh - Ba Đình - Hà Nội',11000000,'https://cloud.muaban.net/images/2022/09/15/525/be7afb81bdac4567b82ff3117b7f4c68.jpg','Cho thuê tầng 1 nhà số 2, ngõ 25A Phan Đình Phùng, cho thuê làm kinh doanh (caphe, spa, salon không bán hàng ăn), văn phòng, phòng khám, lớp học (không ngủ qua đêm), diện tích sử dụng 75m2, sân 25m2, bếp-WC biệt lập, nhà chính chủ.'),
(3,'2021-6-15','Hàng Bông - Hoàn Kiếm - Hà Nội',7000000,'https://cloud.muaban.net/images/2022/10/10/390/d51ae835a8fd4a39b92a790aa159ab74.jpg','Cho thuê nhà ngõ 8 Tống Duy Tân, phường Hàng Bông, quận Hoàn Kiếm, Hà Nội, diện tích 27m2, nhà 3 tầng, có phòng khách, 2 phòng ngủ, vệ sinh, bếp riêng ở ngoài, có điều hòa, nóng lạnh, tủ lạnh, máy giặt... vào ở ngay, nhà gần mặt phố, khu vực sầm uất tiện sinh hoạt'),
(3,'2020-8-19','Phố Huế - Hai Bà Trưng - Hà Nội',8500000,'https://cloud.muaban.net/images/2022/10/03/150/9eaa8b605e89425b9559947f84319f89.jpg','Cho thuê lâu dài căn hộ tầng 2 tập thể phố Yên Bái 1, phường Phố Huế, DT 100 m2, 3 phòng ngủ, phòng khách, 2WC, bếp, 2 ban công, nội thất gồm có: 2 điều hòa, 2 bình nóng lạnh, tủ bếp'),
(3,'2022-8-4','Phương Liệt - Thanh Xuân - Hà Nội',3500000,'https://cloud.muaban.net/images/2022/10/03/258/3eef0cef284c4c9b91a1618d9b8c9a4e.jpg','Cho thuê nhà tầng 3, phố Cửa Đông, quận Hoàn Kiếm. Diện tích 25m2 khép kín, nội thất trang bị cơ bản, thoáng, điện nước theo giá nhà nước'),
(2,'2020-4-16','Thanh Nhàn - Hai Bà Trưng - Hà Nội',4000000,'https://cloud.muaban.net/images/2022/10/03/469/71fd613cd64848d69e4f8838809d5daf.jpg','Cho thuê phòng số 10 Ngõ 98 Kim Ngưu, Phường Thanh Nhàn, quận Hai Bà Trưng, diện tích 40 m2, phòng khép kín, điện nước công tơ'),
(2,'2021-3-15','Hòa Phát - Cẩm Lệ - Đà Nẵng',10000000,'https://cloud.muaban.net/images/2022/10/05/155/d199c82e23844b4a983ceebc49ebb19d.jpg','Nhà mới xây tại 694 Trường Chinh 1,5 tầng, rộng thoáng.
Phàn cho thuê tổng diện tích tầng trệt 90m², mặt tiền rộng 7m chiều cao 2 tầng, kẹp kiệt hông 1,2m. Hướng Đông mát mẻ. Độc lập.
Phòng trong 42m², hiên 21m², sân trước 27m².
Đậu xe ô tô, xe tải vào trong được.
Phù hợp kinh doanh siêu thị, dạy học, kho hàng, nhiều loại hình khác...'),
(2,'2018-12-11','Tân Chánh Hiệp - Quận 12 - TPHCM',25000000,'https://cloud.muaban.net/images/2022/09/28/052/0f1f573e89594bc49e03e4557baf7ab0.jpg','Cho thuê mặt bằng mặt tiền 146 Nguyễn Ảnh Thủ, P.Tân Chánh Hiệp, Q12
Ngang 7x12m, giá 25 triệu')









