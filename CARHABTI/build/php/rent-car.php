<?php
include 'database.php';

header('Content-Type: application/json');
session_start();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

if (!isset($_SESSION['isLoggedIn']) || !$_SESSION['isLoggedIn']) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Not logged in']);
    exit;
}

$email = filter_var($_SESSION['email'] ?? '', FILTER_SANITIZE_EMAIL);
$car_id = filter_var($_POST['carId'] ?? '', FILTER_VALIDATE_INT);
$name = filter_var($_POST['name'] ?? '', FILTER_SANITIZE_STRING);
$phone = filter_var($_POST['tel'] ?? '', FILTER_SANITIZE_STRING);
$address = filter_var($_POST['adresse'] ?? '', FILTER_SANITIZE_STRING);
$message = filter_var($_POST['message'] ?? '', FILTER_SANITIZE_STRING);
$pickup_agence = filter_var($_POST['pickup-agence'] ?? '', FILTER_SANITIZE_STRING);
$pickup_date = filter_var($_POST['pickup-date'] ?? '', FILTER_SANITIZE_STRING);
$pickup_time = filter_var($_POST['pickup-time'] ?? '', FILTER_SANITIZE_STRING);
$return_agence = filter_var($_POST['return-agence'] ?? '', FILTER_SANITIZE_STRING);
$return_date = filter_var($_POST['return-date'] ?? '', FILTER_SANITIZE_STRING);
$return_time = filter_var($_POST['return-time'] ?? '', FILTER_SANITIZE_STRING);
$condition = isset($_POST['condition']) ? 1 : 0;

if ($car_id === false || empty($name) || empty($phone) || empty($email) || empty($address) || empty($pickup_agence) || empty($pickup_date) || empty($pickup_time) || empty($return_agence) || empty($return_date) || empty($return_time) || !$condition) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing or invalid required fields']);
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

if (insert_reservation($car_id, $email, $name, $phone, $address, $message, $pickup_agence, $pickup_date, $pickup_time, $return_agence, $return_date, $return_time)) {
    // Optionally update car disponibility
    update_car_field($car_id, 'disponibility', 0);
    echo json_encode(['success' => true, 'message' => 'Reservation successful']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to create reservation: ' . $conn->error]);
}
?>