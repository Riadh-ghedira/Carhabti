<?php
include 'database.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = $_POST['car-id'] ?? '';
    $name = $_POST['car-name'] ?? '';
    $price = $_POST['car-price'] ?? '';
    $image = $_POST['car-image'] ?? null;
    $features = isset($_POST['features']) && in_array('Air Condition', $_POST['features']) ? 1 : 0;
    $fuel = $_POST['fuel-type'] ?? '';
    $capacity = $_POST['passenger-capacity'] ?? '';
    $transmission = $_POST['transmission'] ?? '';
    $doors = $_POST['doors'] ?? '';
    $crash = $_POST['crash'] ?? '';
    $disponibility = $_POST['disponibility'] ?? '';

    if (empty($id) || empty($name) || empty($price) || empty($fuel) || empty($capacity) || empty($transmission) || empty($doors) || !isset($crash) || !isset($disponibility)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Missing required fields']);
        exit;
    }

    $car = get_car_by_id($id);
    if (!$car) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Car not found']);
        exit;
    }

    $photo = $image ?: $car['photo'];

    $sql = "UPDATE car SET name = ?, price = ?, photo = ?, climatisation = ?, fuel = ?, transmission = ?, capacity = ?, doors = ?, crash = ?, disponibility = ? WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sdssssiisii", $name, $price, $photo, $features, $fuel, $transmission, $capacity, $doors, $crash, $disponibility, $id);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Car updated successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to update car']);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
}
?>