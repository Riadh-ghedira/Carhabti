<?php
// save_account.php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Only handle POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Get the raw POST data
$json = file_get_contents('php://input');
$data = json_decode($json, true);

// Validate the data
if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON data']);
    exit;
}

// Required fields validation
$requiredFields = ['name', 'email', 'password', 'phone'];
foreach ($requiredFields as $field) {
    if (empty($data[$field])) {
        http_response_code(400);
        echo json_encode(['error' => "Missing required field: $field"]);
        exit;
    }
}

// Handle photo upload if present
$photoPath = null;
if (!empty($data['photo'])) {
    // Assuming photo is sent as base64 encoded string
    $photoData = $data['photo'];
    if (preg_match('/^data:image\/(\w+);base64,/', $photoData, $matches)) {
        $extension = $matches[1];
        $photoData = substr($photoData, strpos($photoData, ',') + 1);
        $photoData = base64_decode($photoData);
        
        // Generate unique filename
        $photoName = uniqid('profile_') . '.' . $extension;
        $photoPath = 'uploads/' . $photoName;
        
        // Save the file
        if (!file_exists('uploads')) {
            mkdir('uploads', 0755, true);
        }
        
        if (!file_put_contents($photoPath, $photoData)) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to save photo']);
            exit;
        }
    }
}

// Sanitize the data
$account = [
    'name' => htmlspecialchars($data['name']),
    'email' => filter_var($data['email'], FILTER_SANITIZE_EMAIL),
    'phone' => filter_var($data['phone'], FILTER_SANITIZE_STRING),
    'password' => password_hash($data['password'], PASSWORD_DEFAULT),
    'photo' => $photoPath, // Stores the path to the photo
    'created_at' => date('Y-m-d H:i:s')
];

// File path where data will be stored
$filePath = __DIR__ . '/data/accounts.json';

// Read existing data if file exists
$accounts = [];
if (file_exists($filePath)) {
    $existingData = file_get_contents($filePath);
    $accounts = json_decode($existingData, true) ?: [];
}

// Add new account
$accounts[] = $account;

// Save back to file
if (file_put_contents($filePath, json_encode($accounts, JSON_PRETTY_PRINT))) {
    echo json_encode([
        'success' => true, 
        'message' => 'Account created successfully',
        'account' => [
            'name' => $account['name'],
            'email' => $account['email'],
            'phone' => $account['phone'],
            'photo_url' => $account['photo'] ? basename($account['photo']) : null
        ]
    ]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to save account data']);
}