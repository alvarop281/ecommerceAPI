CREATE DATABASE natufitapi;

CREATE TABLE categories(
    id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    description VARCHAR(191) NOT NULL,
    background VARCHAR(191),
    created_at TIMESTAMP DEFAULT CURRENT_TIME
)

CREATE TABLE items(
    id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(191),
    image VARCHAR(191),
    category_id INT(11) UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIME,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
)

CREATE TABLE products(
    id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    description VARCHAR(191) NOT NULL,
    price DOUBLE NOT NULL,
    quantity INT(10) UNSIGNED NOT NULL,
    status VARCHAR(191) NOT NULL,
    item_id INT(11) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIME,
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
)

CREATE TABLE users(
    id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(191) NOT NULL UNIQUE,
    password VARCHAR(191) NOT NULL,
    full_name VARCHAR(191) NOT NULL,
    dni VARCHAR(191),
    phone_number VARCHAR(191),
    type_of_user VARCHAR(191) DEFAULT 'buyer',
    created_at TIMESTAMP DEFAULT CURRENT_TIME
)

CREATE TABLE addresses(
    id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    address VARCHAR(191),
    reference VARCHAR(191),
    user_id INT(11) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIME,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)


CREATE TABLE orders(
    id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    payment_type VARCHAR(191),
    proof_of_payment VARCHAR(191),
    delivery_method VARCHAR(191),
    commentary VARCHAR(191),
    status VARCHAR(191),
    address_id VARCHAR(191),
    user_id INT(11) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIME,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)

CREATE TABLE details(
    id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ordered_quantity INT(11) UNSIGNED NOT NULL,
    unit_price DOUBLE NOT NULL,
    total_by_product DOUBLE NOT NULL,
    product_id INT(11) NOT NULL,
    order_id INT(11) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIME,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
)
ALTER TABLE details ADD UNIQUE `unique_index`(product_id, order_id);