<?php
include 'database.php';

session_start();

header('Content-Type: application/json');

try {
  $cars = get_car_data();
  if (empty($cars)) {
    echo json_encode(['success' => false, 'message' => 'No cars found'], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
  } else {
    echo json_encode($cars, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
  }
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
}
?>