create database BuyHouse;
use BuyHouse;

create table tAdmin(
	adminId int not null auto_increment primary key ,
	accountAdmin varchar(20) not null,
    passwordAdmin varchar(20) not null
);
drop table tUser;
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

create table Post(
	postId int not null auto_increment primary key,
    datePost date,
    phoneHost varchar(20),
    nameHost varchar(50),
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


insert tUser(email,phone,passwordUR,typeDK) values
('linhninh2@gmail.com','0862861396','linh123',0);
insert tUser(email,phone,passwordUR,typeDK) values('mintduc2612@gmail.com','0367218700','duc123',1);
select * from tUser;
drop table tUser;
truncate table tUser;









