<?php

header('Content-Type: application/json');

try {
    $input = file_get_contents('php://input');
    $accountData = json_decode($input, true);
    echo "php";
    if (!$accountData) {
        throw new Exception('Invalid JSON data');
    }

    
    $accountsFile = '../../data/accounts.json';
    $existingAccounts = file_exists($accountsFile) ? json_decode(file_get_contents($accountsFile), true) : [];
    if (!is_array($existingAccounts)) {
        $existingAccounts = [];
    }
    $existingAccounts[] = $accountData;
    file_put_contents($accountsFile, json_encode($existingAccounts, JSON_PRETTY_PRINT));

    echo json_encode([
        'status' => 'success',
        'message' => 'Account data received successfully',
        'data' => $accountData
    ]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
?>