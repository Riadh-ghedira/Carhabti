<?php
include 'database.php';

header('Content-Type: application/json');
session_start();

ini_set('display_errors', 0);
ini_set('log_errors', 1);
error_log("Starting rent-car.php");
error_log("POST data: " . print_r($_POST, true));

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$email = filter_var($_POST['email'] ?? '', FILTER_SANITIZE_EMAIL);
if (empty($email)) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Email not provided']);
    exit;
}

$car_id = filter_var($_POST['carId'] ?? '', FILTER_VALIDATE_INT);
$name = htmlspecialchars($_POST['name'] ?? '', ENT_QUOTES, 'UTF-8');
$phone = htmlspecialchars($_POST['tel'] ?? '', ENT_QUOTES, 'UTF-8');
$address = htmlspecialchars($_POST['adresse'] ?? '', ENT_QUOTES, 'UTF-8');
$message = htmlspecialchars($_POST['message'] ?? '', ENT_QUOTES, 'UTF-8');
$pickup_agence = htmlspecialchars($_POST['pickup-agence'] ?? '', ENT_QUOTES, 'UTF-8');
$pickup_date = filter_var($_POST['pickup-date'] ?? '', FILTER_SANITIZE_STRING);
$pickup_time = filter_var($_POST['pickup-time'] ?? '', FILTER_SANITIZE_STRING);
$return_agence = htmlspecialchars($_POST['return-agence'] ?? '', ENT_QUOTES, 'UTF-8');
$return_date = filter_var($_POST['return-date'] ?? '', FILTER_SANITIZE_STRING);
$return_time = filter_var($_POST['return-time'] ?? '', FILTER_SANITIZE_STRING);
$condition = isset($_POST['condition']) && $_POST['condition'] === '1' ? 1 : 0;

if ($car_id === false || empty($name) || empty($phone) || empty($email) || empty($address) || empty($pickup_agence) || empty($pickup_date) || empty($pickup_time) || empty($return_agence) || empty($return_date) || empty($return_time) || !$condition) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing or invalid required fields']);
    exit;
}

if (!DateTime::createFromFormat('Y-m-d', $pickup_date) || !DateTime::createFromFormat('Y-m-d', $return_date)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid date format']);
    exit;
}

$pickup_datetime = DateTime::createFromFormat('Y-m-d H:i', "$pickup_date $pickup_time");
$return_datetime = DateTime::createFromFormat('Y-m-d H:i', "$return_date $return_time");
if (!$pickup_datetime || !$return_datetime || $pickup_datetime >= $return_datetime) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Return date/time must be after pickup date/time']);
    exit;
}

$car = get_car_by_id($car_id);
if (!$car) {
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'Car not found']);
    exit;
}

if ($car['disponibility'] == 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Car is not available']);
    exit;
}

try {
    if (insert_reservation($car_id, $email, $name, $phone, $address, $message, $pickup_agence, $pickup_date, $pickup_time, $return_agence, $return_date, $return_time)) {
        update_car_field($car_id, 'disponibility', 0);
        echo json_encode(['success' => true, 'message' => 'Reservation successful']);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to create reservation: ' . $conn->error]);
    }
} catch (Exception $e) {
    error_log("Error in rent-car.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}
?>