<?php
include 'database.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = date_timestamp_get(date_create()) + 1;
    $id = $id % 1000000; 
    $name = $_POST['car-name'] ?? '';
    $price = $_POST['car-price'] ?? '';
    $image = $_POST['car-image'] ?? './src/bg.webp';
    $features = isset($_POST['features']) && in_array('Air Condition', $_POST['features']) ? 1 : 0;
    $fuel = $_POST['fuel-type'] ?? '';
    $capacity = $_POST['passenger-capacity'] ?? '';
    $transmission = $_POST['transmission'] ?? '';

    if (empty($name) || empty($price) || empty($fuel) || empty($capacity) || empty($transmission)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Missing required fields']);
        exit;
    }

    $sql = "INSERT INTO car (id ,name, price, photo, climatisation, fuel, transmission, capacity, rating, nbviews, crash, doors, disponibility) VALUES (?,?, ?, ?, ?, ?, ?, ?, 0, 0, 0, 4, 1)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("dsdssssi",$id, $name, $price, $image, $features, $fuel, $transmission, $capacity);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Car added successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to add car']);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
}
?>