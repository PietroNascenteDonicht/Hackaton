create database hackathon;

create table usuarios (
    id int primary key AUTO_INCREMENT,
    nome varchar(100) not null,
    email varchar(100) unique,
    password_hash varchar(255) not null,
    criado_quando TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
);


create table gravidez ()