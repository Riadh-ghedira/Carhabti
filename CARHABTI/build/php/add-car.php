<?php
include 'database.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['car-name'] ?? '';
    $price = $_POST['car-price'] ?? '';
    $image = $_POST['car-image'] ?? './src/bg.webp';
    $features = isset($_POST['features']) && in_array('Air Condition', $_POST['features']) ? 1 : 0;
    $fuel = $_POST['fuel-type'] ?? '';
    $capacity = $_POST['passenger-capacity'] ?? '';
    $transmission = $_POST['transmission'] ?? '';
    $disponibility = 1; 

    if (empty($name) || empty($price) || empty($fuel) || empty($capacity) || empty($transmission)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Missing required fields']);
        exit;
    }

    $sql = "INSERT INTO car (name, price, photo, climatisation, fuel, transmission, capacity, rating, nbviews, crash, doors, disponibility) VALUES (?, ?, ?, ?, ?, ?, ?, 0, 0, 0, 4, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sdssssi", $name, $price, $image, $features, $fuel, $transmission, $capacity, $disponibility);

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