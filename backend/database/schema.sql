create database hackathon;

create table usuarios (
    id int primary key AUTO_INCREMENT,
    ENUM('padrao', 'medico', 'admin') DEFAULT 'padrao',
    nome varchar(100) not null,
    email varchar(100) unique,
    password_hash varchar(255) not null,
);

CREATE TABLE gravidez (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario int,
    nome VARCHAR(100) NOT NULL,
    gravidez_status ENUM(
        'nao_gestante', 
        'gestante', 
        'pos_parto',
        'finalizado',
    ) DEFAULT 'nao_gestante'

    gravidez_resultado ENUM(
        'nao_gestante',
        'em_espera',
        'nascimento',
        'prematuro_extremo',
        'prematuro_muito',
        'prematuro_moderado',
        'crianca arco-iris',
    ) DEFAULT 'nao',

    foreign key (id_usuario) references usuarios(id)
);

create table historico_medico (
    id int primary key AUTO_INCREMENT,
    id_usuario int,
    condicoes_relevantes longtext,
    --gravidez anteriores e so buscar todas as gravidez que tem o id do usuario

    foreign key (id_usuario) references usuarios(id)
);

create table consultas (
    id int primary key AUTO_INCREMENT,
    id_gravidez int,
    horario_marcado date,
    especialidade varchar(255) not null,
    consulta_status ENUM(
        'a_marcar',
        'marcada',
        'dia_consulta',
        'sucesso',
    ) DEFAULT 'a_marcar',
    notas longtext,

    foreign key (id_gravidez) references gravidez(id)
);

create table resultado_exames(
    id int primary key AUTO_INCREMENT,
    id_consulta int,
    id_usuario int,
    unit ENUM('mg/dL', 'g/dL', 'mmHg', 'kg', '°c') DEFAULT 'kg',

    foreign key (id_usuario) references usuarios(id),
    foreign key (id_gravidez) references gravidez(id),
);

create table conteudos_educacionais(
    id int primary key AUTO_INCREMENT,
    title varchar(100) not null,
    body longtext,
    categoria ENUM(
        'gestacao',
        'nutricao',
        'exames',
        'consultas',
        'saude_mental',
        'atividade_fisica',
        'sinais_de_alerta',
        'parto',
        'pos_parto',
        'condicoes_de_saude',
        'medicamentos',
        'direitos_e_apoio',
    ) DEFAULT 'gestacao',

    revisado_por varchar(100),
);