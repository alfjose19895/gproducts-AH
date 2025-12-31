-- ==========================================================
-- SCRIPT DE CREACIÓN DE BASE DE DATOS - StoreApp
-- Autor: Alfredo Hermoso
-- ==========================================================

-- 1. Creación de la Base de Datos
CREATE DATABASE IF NOT EXISTS store_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE store_db;

-- 2. Tabla de Productos (Catálogo e Inventario)
CREATE TABLE IF NOT EXISTS product (
                                       id INT AUTO_INCREMENT PRIMARY KEY,
                                       name VARCHAR(255) NOT NULL,
    sku VARCHAR(50) NOT NULL UNIQUE,
    price DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;

-- 3. Tabla de Órdenes (Cabecera)
CREATE TABLE IF NOT EXISTS `order` (
                                       id INT AUTO_INCREMENT PRIMARY KEY,
                                       customer_id INT NOT NULL COMMENT '1: Cliente, 2: Admin (Simulados)',
                                       total DECIMAL(10, 2) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'COMPLETED'
    ) ENGINE=InnoDB;

-- 4. Tabla de Detalle de Órdenes (Relación muchos a muchos)
CREATE TABLE IF NOT EXISTS order_item (
                                          id INT AUTO_INCREMENT PRIMARY KEY,
                                          order_id INT NOT NULL,
                                          product_id INT DEFAULT NULL,
                                          quantity INT NOT NULL,
                                          price DECIMAL(10, 2) NOT NULL COMMENT 'Precio histórico al momento de la compra',
    CONSTRAINT fk_order FOREIGN KEY (order_id) REFERENCES `order`(id) ON DELETE CASCADE,
    CONSTRAINT fk_product FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE SET NULL
    ) ENGINE=InnoDB;

-- ==========================================================
-- DATOS DE PRUEBA (SEED DATA)
-- ==========================================================

-- Insertar productos iniciales para el catálogo
INSERT INTO product (name, sku, price, stock) VALUES
                                                  ('Laptop Pro 14"', 'LAP-PRO-001', 1200.00, 5),
                                                  ('Mouse Inalámbrico', 'MOU-WL-002', 25.50, 50),
                                                  ('Teclado Mecánico RGB', 'KEY-RGB-003', 85.00, 15),
                                                  ('Monitor 27" 4K', 'MON-4K-004', 350.00, 8),
                                                  ('Auriculares Noise Cancelling', 'AUD-NC-005', 120.00, 20);

-- Insertar una orden de prueba inicial
INSERT INTO `order` (customer_id, total, created_at) VALUES (1, 1225.50, NOW());

-- Detalle de la orden de prueba
INSERT INTO order_item (order_id, product_id, quantity, price) VALUES
                                                                   (1, 1, 1, 1200.00), -- 1 Laptop
                                                                   (1, 2, 1, 25.50);   -- 1 Mouse