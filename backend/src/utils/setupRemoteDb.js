'use strict';

const mysql = require('mysql2/promise');
const config = require('../config/env');

async function setup() {
  console.log('[setup] Connecting to remote database:', config.db.host);
  
  // Create connection instead of pool for DDL operations
  const conn = await mysql.createConnection({
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    database: config.db.name,
    multipleStatements: true
  });

  try {
    console.log('[setup] Connected successfully. Creating tables...');

    // Queries (without CREATE DATABASE because Aiven doesn't allow it, and without DELIMITER)
    const queries = [
      `CREATE TABLE IF NOT EXISTS users (
          id INT UNSIGNED NOT NULL AUTO_INCREMENT,
          name VARCHAR(120) NOT NULL,
          email VARCHAR(190) NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          role ENUM('customer', 'admin', 'manager', 'courier') NOT NULL DEFAULT 'customer',
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          PRIMARY KEY (id),
          UNIQUE KEY uq_users_email (email),
          KEY idx_users_role (role)
      ) ENGINE=InnoDB;`,

      `CREATE TABLE IF NOT EXISTS categories (
          id INT UNSIGNED NOT NULL AUTO_INCREMENT,
          name VARCHAR(100) NOT NULL,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          PRIMARY KEY (id),
          UNIQUE KEY uq_categories_name (name)
      ) ENGINE=InnoDB;`,

      `CREATE TABLE IF NOT EXISTS menu_items (
          id INT UNSIGNED NOT NULL AUTO_INCREMENT,
          name VARCHAR(150) NOT NULL,
          description TEXT,
          price DECIMAL(10,2) NOT NULL,
          category_id INT UNSIGNED NOT NULL,
          prepare_time SMALLINT UNSIGNED NOT NULL,
          image_url VARCHAR(500),
          is_available TINYINT(1) NOT NULL DEFAULT 1,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          PRIMARY KEY (id),
          KEY idx_menu_items_category (category_id),
          KEY idx_menu_items_available (is_available),
          FOREIGN KEY (category_id) REFERENCES categories(id) ON UPDATE CASCADE ON DELETE RESTRICT
      ) ENGINE=InnoDB;`,

      `CREATE TABLE IF NOT EXISTS orders (
          id INT UNSIGNED NOT NULL AUTO_INCREMENT,
          user_id INT UNSIGNED NOT NULL,
          status ENUM('pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled', 'refunded') NOT NULL DEFAULT 'pending',
          total_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
          delivery_address VARCHAR(255) NOT NULL,
          notes TEXT,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          PRIMARY KEY (id),
          KEY idx_orders_user (user_id),
          KEY idx_orders_status (status),
          KEY idx_orders_created (created_at),
          FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE RESTRICT
      ) ENGINE=InnoDB;`,

      `CREATE TABLE IF NOT EXISTS order_items (
          id INT UNSIGNED NOT NULL AUTO_INCREMENT,
          order_id INT UNSIGNED NOT NULL,
          menu_item_id INT UNSIGNED NOT NULL,
          quantity INT UNSIGNED NOT NULL,
          unit_price DECIMAL(10,2) NOT NULL,
          subtotal DECIMAL(10,2) NOT NULL,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (id),
          UNIQUE KEY uq_order_items_order_menu_item (order_id, menu_item_id),
          KEY idx_order_items_menu_item (menu_item_id),
          FOREIGN KEY (order_id) REFERENCES orders(id) ON UPDATE CASCADE ON DELETE CASCADE,
          FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON UPDATE CASCADE ON DELETE RESTRICT
      ) ENGINE=InnoDB;`,

      `CREATE TABLE IF NOT EXISTS payments (
          id INT UNSIGNED NOT NULL AUTO_INCREMENT,
          order_id INT UNSIGNED NOT NULL,
          amount DECIMAL(10,2) NOT NULL,
          method ENUM('cash', 'wallet', 'bank_transfer', 'card') NOT NULL,
          status ENUM('pending', 'paid', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
          transaction_reference VARCHAR(150),
          paid_at TIMESTAMP NULL,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (id),
          UNIQUE KEY uq_transaction_reference (transaction_reference),
          KEY idx_payments_order (order_id),
          KEY idx_payments_status (status),
          FOREIGN KEY (order_id) REFERENCES orders(id) ON UPDATE CASCADE ON DELETE RESTRICT
      ) ENGINE=InnoDB;`,

      `CREATE TABLE IF NOT EXISTS invoices (
          id INT UNSIGNED NOT NULL AUTO_INCREMENT,
          order_id INT UNSIGNED NOT NULL,
          invoice_number VARCHAR(50) NOT NULL,
          total_amount DECIMAL(10,2) NOT NULL,
          issued_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (id),
          UNIQUE KEY uq_invoice_order (order_id),
          UNIQUE KEY uq_invoice_number (invoice_number),
          FOREIGN KEY (order_id) REFERENCES orders(id) ON UPDATE CASCADE ON DELETE RESTRICT
      ) ENGINE=InnoDB;`,

      `DROP TRIGGER IF EXISTS trg_order_items_before_insert;`,
      `CREATE TRIGGER trg_order_items_before_insert
       BEFORE INSERT ON order_items FOR EACH ROW
       BEGIN SET NEW.subtotal = NEW.quantity * NEW.unit_price; END;`,

      `DROP TRIGGER IF EXISTS trg_order_items_after_insert;`,
      `CREATE TRIGGER trg_order_items_after_insert
       AFTER INSERT ON order_items FOR EACH ROW
       BEGIN UPDATE orders SET total_amount = (SELECT COALESCE(SUM(subtotal), 0) FROM order_items WHERE order_id = NEW.order_id) WHERE id = NEW.order_id; END;`,

      `DROP TRIGGER IF EXISTS trg_order_items_before_update;`,
      `CREATE TRIGGER trg_order_items_before_update
       BEFORE UPDATE ON order_items FOR EACH ROW
       BEGIN SET NEW.subtotal = NEW.quantity * NEW.unit_price; END;`,

      `DROP TRIGGER IF EXISTS trg_order_items_after_update;`,
      `CREATE TRIGGER trg_order_items_after_update
       AFTER UPDATE ON order_items FOR EACH ROW
       BEGIN UPDATE orders SET total_amount = (SELECT COALESCE(SUM(subtotal), 0) FROM order_items WHERE order_id = NEW.order_id) WHERE id = NEW.order_id; END;`,

      `DROP TRIGGER IF EXISTS trg_order_items_after_delete;`,
      `CREATE TRIGGER trg_order_items_after_delete
       AFTER DELETE ON order_items FOR EACH ROW
       BEGIN UPDATE orders SET total_amount = (SELECT COALESCE(SUM(subtotal), 0) FROM order_items WHERE order_id = OLD.order_id) WHERE id = OLD.order_id; END;`
    ];

    for (let i = 0; i < queries.length; i++) {
      await conn.query(queries[i]);
    }

    console.log('[setup] All tables and triggers created successfully on Aiven!');

  } catch (err) {
    console.error('[setup] Failed to execute queries:', err);
  } finally {
    await conn.end();
  }
}

setup();
