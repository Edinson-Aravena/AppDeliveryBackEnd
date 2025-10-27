-- Script de configuración de la base de datos unificada
-- Ejecuta este script en MySQL para crear la base de datos y todas las tablas

-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS delivery_app;
USE delivery_app;

-- USERS (Actualizado para soportar ambos sistemas)
CREATE TABLE IF NOT EXISTS users(
	id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) UNIQUE,
    username VARCHAR(90) UNIQUE,
    name VARCHAR(90) NOT NULL,
    lastname VARCHAR(90),
    phone VARCHAR(90) UNIQUE,
    image VARCHAR(255) NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'CHEF', 'WAITER', 'CLIENTE', 'RESTAURANTE', 'REPARTIDOR') DEFAULT 'WAITER',
    created_at timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ROLES
CREATE TABLE IF NOT EXISTS roles(
	id bigint primary key auto_increment,
    name varchar(90) not null unique,
    image varchar(255) null,
    route varchar(180) not null,
    created_at timestamp(0) not null DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(0) not null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insertar roles iniciales
INSERT INTO roles(name, route) VALUES
('RESTAURANTE', '/restaurant/orders/list'),
('REPARTIDOR', '/delivery/orders/list'),
('CLIENTE', '/client/orders/list'),
('ADMIN', '/admin/dashboard'),
('CHEF', '/chef'),
('WAITER', '/order/cafe')
ON DUPLICATE KEY UPDATE route = VALUES(route);

-- Tabla intermedia Usuario-Roles
CREATE TABLE IF NOT EXISTS user_has_roles(
	id_user bigint not null,
    id_rol bigint not null,
    created_at timestamp(0) not null DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(0) not null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    foreign key(id_user) references users(id) on update cascade on delete cascade,
    foreign key(id_rol) references roles(id) on update cascade on delete cascade,
    primary key(id_user, id_rol)
);

-- CATEGORIES (Actualizado para soportar ambos sistemas)
CREATE TABLE IF NOT EXISTS categories(
	id bigint primary key auto_increment,
    name varchar(180) not null,
    description text,
    slug varchar(90),
    icon varchar(255),
    image varchar(255) null,
    created_at timestamp(0) not null DEFAULT CURRENT_TIMESTAMP,
	updated_at timestamp(0) not null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- PRODUCTS (Actualizado para soportar ambos sistemas)
CREATE TABLE IF NOT EXISTS products(
	id bigint primary key auto_increment,
    name varchar(180) not null,
    description text,
    price decimal(10,2) not null,
    image varchar(255) null,
    image1 varchar(255) null,
    image2 varchar(255) null,
    image3 varchar(255) null,
    id_category bigint not null,
    created_at timestamp(0) not null DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(0) not null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    foreign key(id_category) references categories(id) on update cascade on delete cascade
);

-- ADDRESS
CREATE TABLE IF NOT EXISTS address(
	id bigint primary key auto_increment,
    address varchar(255) not null,
    neighborhood varchar(180) not null,
    lat double not null,
    lng double not null,
    created_at timestamp(0) not null DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(0) not null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    id_user bigint not null,
    foreign key (id_user) references users(id) on update cascade on delete cascade
);

-- DELIVERY ORDERS (Órdenes del sistema de delivery)
CREATE TABLE IF NOT EXISTS orders(
	id bigint primary key auto_increment,
    id_client bigint not null,
    id_delivery bigint null,
    id_address bigint not null,
    lat double,
    lng double,
    status varchar(90) not null,
    timestamp bigint not null,
    created_at timestamp(0) not null DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(0) not null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    foreign key(id_client) references users(id) on update cascade on delete cascade,
	foreign key(id_delivery) references users(id) on update cascade on delete cascade,
	foreign key(id_address) references address(id) on update cascade on delete cascade
);

-- Tabla intermedia Órdenes-Productos de Delivery
CREATE TABLE IF NOT EXISTS orders_has_products(
	id_order bigint not null,
    id_product bigint not null,
    quantity bigint not null,
    created_at timestamp(0) not null DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(0) not null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    primary key(id_order, id_product),
    foreign key(id_order) references orders(id) on update cascade on delete cascade,
    foreign key(id_product) references products(id) on update cascade on delete cascade
);

-- QUIOSCO ORDERS (Órdenes del sistema de quiosco)
CREATE TABLE IF NOT EXISTS orders_quiosco(
	id int primary key auto_increment,
    name varchar(255) not null,
    total double not null,
    date datetime not null default current_timestamp,
    status boolean default false,
    order_in_progress_at datetime null,
    order_ready_at datetime null,
    order_delivered_at datetime null
);

-- Tabla de productos del quiosco
CREATE TABLE IF NOT EXISTS order_products_quiosco(
	id int primary key auto_increment,
    order_id int not null,
    product_id bigint not null,
    quantity int not null,
    foreign key(order_id) references orders_quiosco(id) on update cascade on delete cascade,
    foreign key(product_id) references products(id) on update cascade on delete cascade
);

-- Crear un usuario admin por defecto (password: admin123)
-- Hash bcrypt para 'admin123'
INSERT INTO users(username, name, password, role) VALUES
('admin', 'Administrador', '$2a$10$xN0dXvBSFjOXqFqN8z6mRuGfYQPU7lHGJ/3OhKCkYK8vr9dXK6L2q', 'ADMIN')
ON DUPLICATE KEY UPDATE username = username;

SELECT 'Base de datos configurada exitosamente!' as Mensaje;
