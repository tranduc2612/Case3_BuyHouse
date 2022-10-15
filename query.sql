create database BuyHouse;
drop database BuyHouse;
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
    gender varchar(20),
    constraint foreign key (adminId) references tAdmin(adminId)
);


-- title, lat-vi do, lng-kinh do, status - dang thue, cho thue (con phong)
create table Post(
	postId int not null auto_increment primary key,
    userId int,
    datePost date,
    addressPost text,
    cost long,
    descriptionPost longtext,
    title text,
    lat double,
    lng double,
    statusHouse varchar(50),
    constraint foreign key(userId) references tUser(userId)
);

create table Image(
	url text,
    imgId int auto_increment not null primary key,
    postId int,
    constraint foreign key(postId) references Post(postId)
);

-- notification
create table Noti(
	statusNoti varchar(50),
    dateNoti date,
    userId int,
    postId int,
    constraint primary key(userId,postId),
    constraint foreign key(userId) references tUser(userId),
    constraint foreign key(postId) references Post(postId)
);
create table tComment(
	content text,
    dateComment date,
    userId int,
    postId int,
    constraint primary key(userId,postId),
    constraint foreign key(userId) references tUser(userId),
    constraint foreign key(postId) references Post(postId)
    
);


insert tAdmin(accountAdmin,passwordAdmin) values
('admin','admin');
-- 1 la chu
-- 0 la thue
select * from tUser;
insert tUser(email,phone,passwordUR,typeDK,gender,address,cccd,nameUser) values
('linhninh2@gmail.com','0862861396','linh123',0,'nu','Huyện Đông Anh,thành phố Hà Nội','001302011253','Trần Mỹ Linh'),
('mintduc2612@gmail.com','0367218700','duc123',1,'nam','Phường Cẩm Sơn,thành phố Cẩm Phả,tỉnh Quảng Ninh','022202002528','Trần Minh Đức'),
('Minhanh190202@gmail.com','0978363413','minhanh123',1,'nam','Huyện Gia Lâm,thành phố Hà Nội','001302011234','Trần Minh Anh');

select * from Post;

insert Post(title,userId,datePost,addressPost,lat,lng,cost,statusHouse,descriptionPost)
values ('Cho thuê nhà ở Láng Hạ, Đống Đa',2,'2022-10-10','Láng Hạ - Đống Đa - Hà Nội','21.016748','105.810718',14000000,'cho thuê','Cho thuê nhà tại phố Hoàng Ngọc Phách, Láng Hạ, quận Đống Đa, Hà Nội 
- Nhà tầng 1 mặt phố, diện tích 32m2.
- Mặt ngõ rộng ôtô rất thuận tiện cho mở văn phòng công ty, lớp học, spa.');
insert Post(title,userId,datePost,addressPost,lat,lng,cost,statusHouse,descriptionPost)
values
('Chính chủ cho thuê nhà ở Thanh Nhàn, Hai Bà Trưng',2,'2022-10-11','Thanh Nhàn - Hai Bà Trưng - Hà Nội','21.008905','105.859687',16000000,'cho thuê','Chính chủ cho thuê nhà đầu ngõ 281 Trần Khát Chân. Diện tích 55m2, nhà 4 tầng, 2 mặt thoáng, tất cả các phòng đều có cửa sổ. Vệ sinh khép kín mỗi tầng, nóng lạnh đầy đủ. 
Nhà đầu ngõ tiện ở kết hợp kinh doanh.');
insert Post(title,userId,datePost,addressPost,lat,lng,cost,statusHouse,descriptionPost)
values
('Cho thuê tầng 1 trong nhà 5 tầng',2,'2019-10-21','Quán Thánh - Ba Đình - Hà Nội','21.040019','105.844690',11000000,'cho thuê','Cho thuê tầng 1 nhà số 2, ngõ 25A Phan Đình Phùng, cho thuê làm kinh doanh (caphe, spa, salon không bán hàng ăn), văn phòng, phòng khám, lớp học (không ngủ qua đêm), diện tích sử dụng 75m2, sân 25m2, bếp-WC biệt lập, nhà chính chủ.');
insert Post(title,userId,datePost,addressPost,lat,lng,cost,statusHouse,descriptionPost)
values
('Cho thuê nhà 3 tầng trong ngõ ',3,'2021-6-15','Hàng Bông - Hoàn Kiếm - Hà Nội','21.029630','105.843691',7000000,'cho thuê','Cho thuê nhà ngõ 8 Tống Duy Tân, phường Hàng Bông, quận Hoàn Kiếm, Hà Nội, diện tích 27m2, nhà 3 tầng, có phòng khách, 2 phòng ngủ, vệ sinh, bếp riêng ở ngoài, có điều hòa, nóng lạnh, tủ lạnh, máy giặt... vào ở ngay, nhà gần mặt phố, khu vực sầm uất tiện sinh hoạt');
insert Post(title,userId,datePost,addressPost,lat,lng,cost,statusHouse,descriptionPost)
values
('Cho thuê căn hộ ở tầng 2 trong khu tập thể',3,'2020-8-19','Phố Huế - Hai Bà Trưng - Hà Nội','21.029608','105.843706',8500000,'cho thuê','Cho thuê lâu dài căn hộ tầng 2 tập thể phố Yên Bái 1, phường Phố Huế, DT 100 m2, 3 phòng ngủ, phòng khách, 2WC, bếp, 2 ban công, nội thất gồm có: 2 điều hòa, 2 bình nóng lạnh, tủ bếp');
insert Post(title,userId,datePost,addressPost,lat,lng,cost,statusHouse,descriptionPost)
values
('Cho thuê nhà tầng 3, điện nước giá dân',3,'2022-8-4','Phương Liệt - Thanh Xuân - Hà Nội','21.034841','105.845655',3500000,'cho thuê ','Cho thuê nhà tầng 3, phố Cửa Đông, quận Hoàn Kiếm. Diện tích 25m2 khép kín, nội thất trang bị cơ bản, thoáng, điện nước theo giá nhà nước');
insert Post(title,userId,datePost,addressPost,lat,lng,cost,statusHouse,descriptionPost)
values
('Cho thuê phòng, có công tơ riêng',2,'2020-4-16','Thanh Nhàn - Hai Bà Trưng - Hà Nội','21.006287','105.860464',4000000,'cho thuê','Cho thuê phòng số 10 Ngõ 98 Kim Ngưu, Phường Thanh Nhàn, quận Hai Bà Trưng, diện tích 40 m2, phòng khép kín, điện nước công tơ');
insert Post(title,userId,datePost,addressPost,lat,lng,cost,statusHouse,descriptionPost)
values
('Cho thuê nhà mới xây, 1.5 tầng, thoáng mát',2,'2021-3-15','Hòa Phát - Cẩm Lệ - Đà Nẵng','16.039077','108.186226',50000000,'cho thuê','Nhà mới xây tại 694 Trường Chinh 1,5 tầng, rộng thoáng.
Phàn cho thuê tổng diện tích tầng trệt 90m², mặt tiền rộng 7m chiều cao 2 tầng, kẹp kiệt hông 1,2m. Hướng Đông mát mẻ. Độc lập.
Phòng trong 42m², hiên 21m², sân trước 27m².
Đậu xe ô tô, xe tải vào trong được.
Phù hợp kinh doanh siêu thị, dạy học, kho hàng, nhiều loại hình khác...');
insert Post(title,userId,datePost,addressPost,lat,lng,cost,statusHouse,descriptionPost)
values
('Cho thuê mặt bằng, mặt tiền tại Quận 12 ',2,'2018-12-11','Tân Chánh Hiệp - Quận 12 - TPHCM','10.874773','106.622543',25000000,'cho thuê','Cho thuê mặt bằng, mặt tiền 146 Nguyễn Ảnh Thủ, P.Tân Chánh Hiệp, Q12
Ngang 7x12m, giá 25 triệu');

insert Image(postId, url)
values(1,'https://cloud.muaban.net/images/2022/09/15/525/e2895ab6d9994a4596e41638be0e0f58.jpg'),
(1,'https://cloud.muaban.net/images/2022/09/15/524/d9a2de32df9d49669f7771f865111d03.jpg'),
(1,'https://cloud.muaban.net/images/2022/09/15/525/be7afb81bdac4567b82ff3117b7f4c68.jpg');
insert Image(postId, url)
values(2,'https://cloud.muaban.net/images/2022/10/03/594/627f903d015d4e2c870d10c386fc1c57.jpg'),
(2,'https://cloud.muaban.net/images/2022/10/03/593/8a8f3d2e4c9b472cae9b7ee23c3c4868.jpg'),
(2,'https://cloud.muaban.net/images/2022/10/03/593/ff8be5c6e9474ca39ff99dcd2a8a315c.jpg'),
(3,'https://cloud.muaban.net/images/thumb-detail/2021/07/14/440/6c0971114eee4ba4b471047679a773e5.jpg'),
(3,'https://cloud.muaban.net/images/thumb-detail/2021/07/14/450/6185f7e689ea4d2384826024f84649d7.jpg'),
(3,'https://cloud.muaban.net/images/thumb-detail/2021/07/14/442/bbd10243e084446bbcf4f7a90e698aed.jpg'),
(3,'https://cloud.muaban.net/images/thumb-detail/2021/07/14/449/a1f93bc8c80f4680b174d1f123c03a2b.jpg'),
(4,'https://cloud.muaban.net/images/2022/10/03/469/71fd613cd64848d69e4f8838809d5daf.jpg'),
(4,'https://cloud.muaban.net/images/2022/10/03/469/55280e24faa84475bbb53cb35f965610.jpg'),
(4,'https://cloud.muaban.net/images/2022/10/03/476/8cfb6090beab496cb2051d99653313e4.jpg'),
(4,'https://cloud.muaban.net/images/2022/10/03/479/39358472139b40c58990119e7f24aaea.jpg'),
(5,'https://cloud.muaban.net/images/2022/09/29/238/928fa74928fd47c181ff9878685494e7.jpg'),
(5,'https://cloud.muaban.net/images/2022/09/29/237/0ba927e80cdc4178a653e4aad15b3bcf.jpg'),
(5,'https://cloud.muaban.net/images/2022/09/29/236/3f4feb0461e348779f15a57aee1c680d.jpg'),
(5,'https://cloud.muaban.net/images/2022/09/29/237/de55134ba6974bfea8848191984ce0c3.jpg');
insert Image(postId, url)
values 
(6,'https://cloud.muaban.net/images/2022/10/10/572/376a4e6b234042b49c8a0c01e5d2661c.jpg'),
(6,'https://cloud.muaban.net/images/2022/10/10/572/2248423affd649a79e25a425f7947401.jpg'),
(6,'https://cloud.muaban.net/images/2022/10/10/572/5445d8fb46ad4289a043c4e373d8cba7.jpg'),
(6,'https://cloud.muaban.net/images/2022/10/10/572/787974b4f0aa47b582973d46181d9c71.jpg'),
(7,'https://cloud.muaban.net/images/2022/08/15/103/e1551e592d0e4f19a9e651cfe5d8c9e3.jpg'),
(7,'https://cloud.muaban.net/images/2022/08/15/104/0f4ced6fe78f44a9bd8021dab0654b88.jpg'),
(7,'https://cloud.muaban.net/images/2022/08/15/109/62608136d30a442c996c4edfa0e5d8b6.jpg'),
(7,'https://cloud.muaban.net/images/2022/08/15/104/1858eaa5954c4fef8b8ba1ea9d1147fd.jpg'),
(7,'https://cloud.muaban.net/images/2022/08/15/102/aa52a22a99bf45a7859c2f7a5b75fc1a.jpg'),
(8,'https://cloud.muaban.net/images/2022/10/14/247/6de7836f5cfc4557bbf8695f9b1e28aa.jpg'),
(8,'https://cloud.muaban.net/images/2022/10/14/247/7fc7ded222064caca33260412c85a405.jpg'),
(9,'https://cloud.muaban.net/images/2022/10/13/221/9935b693180c4743b607dcb14bfd8444.jpg'),
(9,'https://cloud.muaban.net/images/2022/10/13/223/d340b4a7b5ff4b6d87ad6ee2e94b55d3.jpg'),
(9,'https://cloud.muaban.net/images/2022/10/13/221/d83ce7f74ccd4ac6aa7347d1c899cd9b.jpg'),
(9,'https://cloud.muaban.net/images/2022/10/13/221/f4383989522641319595007811d75af5.jpg');
select * from Image;


select distinct Post.postId, title, cost, datePost,address, url from Post join Image on Image.postId = Post.postId group by Post.postId;

update tUser 
set passwordUR = 'Linh123'
where userId = 1
