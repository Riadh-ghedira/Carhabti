<?php
$db_host = 'localhost';
$db_user = 'root';
$db_pass = '';
$db_name = 'carhabti';
$db_port = 3306;

try {
    $conn = new mysqli($db_host, $db_user, $db_pass, $db_name, $db_port);
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }
    $conn->set_charset("utf8mb4");
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database connection failed: ' . $e->getMessage()]);
    exit;
}

function get_emails() {
    global $conn;
    $emails = [];
    $query = "SELECT email FROM account";
    $result = $conn->query($query);
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $emails[] = $row['email'];
        }
        $result->free();
    }
    return $emails;
}

function get_user_data($email) {
    global $conn;
    $sql = "SELECT name, email, password, admin, phone, address, birth, cin, licence, photo FROM account WHERE email = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->num_rows > 0 ? $result->fetch_assoc() : null;
    $stmt->close();
    return $user;
}

function update_user_field($email, $field, $value) {
    global $conn;
    $allowed_fields = ['name', 'password', 'phone', 'address', 'birth', 'cin', 'licence', 'photo'];
    if (!in_array($field, $allowed_fields)) {
        return false;
    }
    $sql = "UPDATE account SET $field = ? WHERE email = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $value, $email);
    $result = $stmt->execute();
    $stmt->close();
    return $result;
}

function verify_user_password($email, $password) {
    global $conn;
    $sql = "SELECT password FROM account WHERE email = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        $stmt->close();
        return password_verify($password, $user['password']);
    }
    $stmt->close();
    return false;
}

function get_car_data() {
    global $conn;
    $cars = [];
    $query = "SELECT id, name, price, photo, climatisation, fuel, transmission, capacity, rating, nbviews, crash, doors, disponibility FROM car";
    $result = $conn->query($query);
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $cars[] = $row;
        }
        $result->free();
    }
    return $cars;
}

function get_car_by_id($car_id) {
    global $conn;
    $sql = "SELECT id, name, price, photo, climatisation, fuel, transmission, capacity, rating, nbviews, crash, doors, disponibility FROM car WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $car_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $car = $result->num_rows > 0 ? $result->fetch_assoc() : null;
    $stmt->close();
    return $car;
}

function update_car_field($car_id, $field, $value) {
    global $conn;
    $allowed_fields = ['name', 'price', 'photo', 'climatisation', 'fuel', 'transmission', 'capacity', 'rating', 'nbviews', 'crash', 'doors', 'disponibility'];
    if (!in_array($field, $allowed_fields)) {
        return false;
    }
    $sql = "UPDATE car SET $field = ? WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("si", $value, $car_id);
    $result = $stmt->execute();
    $stmt->close();
    return $result;
}

function insert_reservation($car_id, $email, $name, $phone, $address, $message, $pickup_agence, $pickup_date, $pickup_time, $return_agence, $return_date, $return_time) {
    global $conn;
    $sql = "INSERT INTO reservations (car_id, email, name, phone, address, message, pickup_agence, pickup_date, pickup_time, return_agence, return_date, return_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("isssssssssss", $car_id, $email, $name, $phone, $address, $message, $pickup_agence, $pickup_date, $pickup_time, $return_agence, $return_date, $return_time);
    $result = $stmt->execute();
    $stmt->close();
    return $result;
}

function get_reservations_by_email($email) {
    global $conn;
    $reservations = [];
    $sql = "SELECT r.*, c.name AS car_name FROM reservations r JOIN car c ON r.car_id = c.id WHERE r.email = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    while ($row = $result->fetch_assoc()) {
        $reservations[] = $row;
    }
    $stmt->close();
    return $reservations;
}

register_shutdown_function(function() use ($conn) {
    if ($conn) {
        $conn->close();
    }
});
?>