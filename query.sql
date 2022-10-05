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
    phone varchar(20) not null,
    passwordUR varchar(20) not null,
    email varchar(70) not null,
    cccd varchar(20),
    typeDK bit,
    dateDK date,
    constraint foreign key (adminId) references tAdmin(adminId)
);

drop table tUser;

insert tAdmin(accountAdmin,passwordAdmin) values
('admin','admin');
-- 0 la chu
-- 1 la thue

insert tUser(email,phone,passwordUR,typeDK) values
('linh@gmail.com','0862861396','linh123',1),
('minhanh@gamil.com','0978363413','minhanh123',0);


insert tUser(email,phone,passwordUR,typeDK) values('mintduc2612@gmail.com','0367218700','duc123',1);

select * from tUser;






