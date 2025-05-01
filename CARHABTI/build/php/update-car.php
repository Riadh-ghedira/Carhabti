<?php
include 'database.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$id = filter_var($_POST['car-id'] ?? '', FILTER_VALIDATE_INT);
$name = htmlspecialchars($_POST['car-name'] ?? '', ENT_QUOTES, 'UTF-8');
$price = filter_var($_POST['car-price'] ?? '', FILTER_SANITIZE_STRING);
$image = $_POST['car-image'] ?? null;
$features = isset($_POST['features']) && in_array('Air Condition', $_POST['features']) ? 1 : 0;
$fuel = htmlspecialchars($_POST['fuel-type'] ?? '', ENT_QUOTES, 'UTF-8');
$capacity = filter_var($_POST['passenger-capacity'] ?? '', FILTER_SANITIZE_STRING);
$transmission = htmlspecialchars($_POST['transmission'] ?? '', ENT_QUOTES, 'UTF-8');
$doors = filter_var($_POST['doors'] ?? '', FILTER_SANITIZE_STRING);
$crash = filter_var($_POST['crash'] ?? '', FILTER_SANITIZE_STRING);
$disponibility = filter_var($_POST['disponibility'] ?? '', FILTER_SANITIZE_STRING);

if (empty($id)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Car ID is required']);
    exit;
}

$car = get_car_by_id($id);
if (!$car) {
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'Car not found']);
    exit;
}

$name = !empty($name) ? $name : $car['name'];
$price = !empty($price) ? $price : $car['price'];
$photo = !empty($image) && strpos($image, 'data:image/') === 0 ? $image : $car['photo'];
$fuel = !empty($fuel) ? $fuel : $car['fuel'];
$capacity = !empty($capacity) ? $capacity : $car['capacity'];
$transmission = !empty($transmission) ? $transmission : $car['transmission'];
$doors = !empty($doors) ? $doors : $car['doors'];
$crash = isset($_POST['crash']) ? $crash : $car['crash'];
$disponibility = isset($_POST['disponibility']) ? $disponibility : $car['disponibility'];

$sql = "UPDATE car SET name = ?, price = ?, photo = ?, climatisation = ?, fuel = ?, transmission = ?, capacity = ?, doors = ?, crash = ?, disponibility = ? WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sdssssiisii", $name, $price, $photo, $features, $fuel, $transmission, $capacity, $doors, $crash, $disponibility, $id);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Car updated successfully']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to update car: ' . $conn->error]);
}
$stmt->close();
?>