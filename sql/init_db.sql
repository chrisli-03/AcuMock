CREATE DATABASE IF NOT EXISTS acu_mock;
USE acu_mock;
CREATE TABLE IF NOT EXISTS tb_server (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    status INTEGER NOT NULL,
    redirectAddress VARCHAR(255)
);
CREATE TABLE IF NOT EXISTS tb_api (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    server INTEGER NOT NULL,
    url VARCHAR(255) NOT NULL,
    type INTEGER NOT NULL,
    status INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS tb_response (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    api INTEGER NOT NULL,
    response_key VARCHAR(255) NOT NULL,
    response_value VARCHAR(255),
    fixed INTEGER NOT NULL,
    type INTEGER NOT NULL,
    parent INTEGER
);