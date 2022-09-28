create database BuyHouse;
use BuyHouse;

create table tAdmin(
	adminId int not null auto_increment primary key ,
	accountAdmin varchar(20) not null,
    passwordAdmin varchar(20) not null
);
drop table tAdmin;
create table tUserRenter(
	userRenterId int not null auto_increment primary key,
    adminId int,
    nameRent varchar(20) not null,
    address varchar(50),
    phone varchar(20) not null,
    passwordUR varchar(20) not null,
    constraint foreign key (adminId) references tAdmin(adminId)
);

create table tUserHost(
	userHostId int not null auto_increment primary key,
    adminId int,
    nameHost varchar(20) not null,
    address varchar(50),
    phone varchar(20) not null,
    passwordHost varchar(20) not null,
    constraint foreign key (adminId) references tAdmin(adminId)
);
