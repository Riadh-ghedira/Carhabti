CREATE DATABASE IF NOT EXISTS carhabti;

CREATE TABLE carhabti.account (
    email VARCHAR(255) NOT NULL PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    photo TEXT,
    birth DATE,
    cin VARCHAR(20),
    licence VARCHAR(20),
    address VARCHAR(255),
    admin BOOLEAN NOT NULL DEFAULT 0
);


CREATE TABLE carhabti.car (
    id BIGINT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price INT NOT NULL,
    fuel VARCHAR(50) NOT NULL,
    transmission VARCHAR(50) NOT NULL,
    climatisation TINYINT(1) NOT NULL,
    capacity INT NOT NULL DEFAULT 5,
    doors INT NOT NULL DEFAULT 4,
    photo TEXT NOT NULL,
    carsh TINYINT(1) NOT NULL DEFAULT 0,
    disponibility TINYINT(1) NOT NULL DEFAULT 1,
    nbviews INT NOT NULL DEFAULT 0,
    rating FLOAT NOT NULL DEFAULT 0
);

CREATE TABLE reservations ( 
    id INT AUTO_INCREMENT PRIMARY KEY, 
    car_id INT NOT NULL REFERENCES car (id), 
    email VARCHAR(255) NOT NULL, 
    name VARCHAR(100) NOT NULL, 
    phone VARCHAR(20) NOT NULL, 
    address TEXT NOT NULL, 
    message TEXT, 
    pickup_agence VARCHAR(100) NOT NULL, 
    pickup_date DATE NOT NULL, 
    pickup_time TIME NOT NULL, 
    return_agence VARCHAR(100) NOT NULL, 
    return_date DATE NOT NULL,
    return_time TIME NOT NULL, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

INSERT INTO car (id, name, price, fuel, transmission, climatisation, capacity, doors, photo, carsh, disponibility, nbviews, rating)
VALUES
(0, 'Renault Megane', 100, 'Essence', 'Auto', 1, 4, 4, './src/car-4.webp', 0, 1, 2362, 4.8),
(1, 'Dacia Logan', 80, 'Diesel', 'Manuelle', 0, 6, 4, './src/car-1.webp', 0, 1, 1258, 4.0),
(3, 'Dacia Logan', 100, 'Diesel', 'Manuelle', 1, 6, 4, './src/car-1.webp', 0, 1, 501, 4.2),
(4, 'Renault Megane', 100, 'Diesel', 'Manuelle', 1, 4, 4, './src/car-4.webp', 0, 1, 229, 4.7),
(5, 'Peugeot 208', 90, 'Essence', 'Auto', 1, 5, 4, './src/bg.webp', 0, 1, 681, 4.0),
(6, 'Volkswagen Golf', 110, 'Diesel', 'Auto', 1, 5, 4, './src/bg.webp', 0, 1, 0, 5.0),
(7, 'Toyota Corolla', 95, 'Essence', 'Manuelle', 1, 5, 4, './src/bg.webp', 0, 1, 0, 5.0),
(8, 'Ford Fiesta', 85, 'Essence', 'Manuelle', 0, 4, 4, './src/bg.webp', 0, 1, 0, 5.0),
(9, 'Honda Civic', 105, 'Essence', 'Auto', 1, 5, 4, './src/bg.webp', 0, 1, 0, 5.0),
(10, 'Chevrolet Spark', 70, 'Essence', 'Manuelle', 0, 4, 4, './src/bg.webp', 0, 1, 0, 5.0),
(11, 'Hyundai Elantra', 100, 'Essence', 'Auto', 1, 5, 4, './src/bg.webp', 0, 1, 0, 5.0),
(12, 'Kia Rio', 85, 'Essence', 'Manuelle', 1, 5, 4, './src/bg.webp', 0, 1, 0, 5.0),
(13, 'Mazda 3', 95, 'Essence', 'Auto', 1, 5, 4, './src/bg.webp', 0, 1, 0, 5.0),
(14, 'Nissan Sentra', 90, 'Essence', 'Manuelle', 1, 5, 4, './src/bg.webp', 0, 1, 0, 5.0),
(15, 'Subaru Impreza', 110, 'Essence', 'Auto', 1, 5, 4, './src/bg.webp', 0, 1, 0, 5.0),
(16, 'Tesla Model 3', 150, 'Electric', 'Auto', 1, 5, 4, './src/bg.webp', 0, 1, 0, 5.0),
(17, 'BMW 3 Series', 130, 'Diesel', 'Auto', 1, 5, 4, './src/bg.webp', 0, 1, 0, 5.0),
(18, 'Audi A4', 140, 'Diesel', 'Auto', 1, 5, 4, './src/bg.webp', 0, 1, 0, 5.0),
(1743617388797, 'Polo 3', 2, 'Petrol', 'Manual', 0, 2, 4, './src/bg.webp', 0, 1, 0, 0.0),
(1743620290781, 'Golf 1', 2, 'Hybrid', 'Manual', 1, 8, 4, './src/bg.webp', 0, 1, 0, 0.0),
(1743620655272, 'Golf 8', 100, 'Petrol', 'Automatic', 1, 4, 4, './src/bg.webp', 0, 1, 0, 0.0);




