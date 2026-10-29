CREATE DATABASE IF NOT EXISTS parque_vivo
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE parque_vivo;

CREATE TABLE IF NOT EXISTS usuarios (
  id_usuario BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  nome VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL,
  senha_hash VARCHAR(255) NOT NULL,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id_usuario),
  UNIQUE KEY uq_usuarios_email (email)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS quadras (
  id_quadra BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  nome VARCHAR(100) NOT NULL,
  esporte VARCHAR(80) NOT NULL,
  descricao VARCHAR(500) NULL,
  ativa BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_quadra),
  KEY idx_quadra_ativa (ativa)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS agendamentos (
  id_agendamento BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_usuario BIGINT UNSIGNED NOT NULL,
  id_quadra BIGINT UNSIGNED NOT NULL,
  inicio DATETIME NOT NULL,
  fim DATETIME NOT NULL,
  status ENUM('confirmado', 'cancelado') NOT NULL DEFAULT 'confirmado',
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  cancelado_em DATETIME NULL,
  PRIMARY KEY (id_agendamento),
  CONSTRAINT fk_agendamento_usuario FOREIGN KEY (id_usuario)
    REFERENCES usuarios (id_usuario),
  CONSTRAINT fk_agendamento_quadra FOREIGN KEY (id_quadra)
    REFERENCES quadras (id_quadra),
  CONSTRAINT chk_agendamento_duracao CHECK (fim > inicio),
  KEY idx_agendamento_quadra_periodo (id_quadra, inicio, fim, status),
  KEY idx_agendamento_usuario (id_usuario, inicio)
) ENGINE=InnoDB;

-- Exemplos iniciais: substitua pelos nomes e modalidades reais do parque.
INSERT INTO quadras (nome, esporte, descricao)
SELECT 'Quadra 1', 'Futsal', 'Quadra esportiva do parque'
WHERE NOT EXISTS (SELECT 1 FROM quadras WHERE nome = 'Quadra 1');

INSERT INTO quadras (nome, esporte, descricao)
SELECT 'Quadra 2', 'Vôlei', 'Quadra esportiva do parque'
WHERE NOT EXISTS (SELECT 1 FROM quadras WHERE nome = 'Quadra 2');
