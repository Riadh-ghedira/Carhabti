<?php
include 'database.php';

header('Content-Type: application/json');

session_start();

$email = null;
if (isset($_SESSION['email']) && !empty($_SESSION['email'])) {
    $email = $_SESSION['email'];
} elseif (isset($_COOKIE['localStorageEmail'])) {
    $email = $_COOKIE['localStorageEmail'];
} elseif (isset($_SERVER['HTTP_X_EMAIL'])) {
    $email = $_SERVER['HTTP_X_EMAIL'];
} elseif (isset($_GET['email'])) {
    $email = $_GET['email'];
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!$email) {
        echo json_encode([
            "status" => "error",
            "message" => "Not logged in"
        ]);
        exit;
    }

    if (!isset($_POST['field']) || !isset($_POST['value'])) {
        echo json_encode([
            "status" => "error",
            "message" => "Missing field or value"
        ]);
        exit;
    }
    
    $field = $_POST['field'];
    $value = $_POST['value'];

    switch ($field) {
        case 'name':
            $result = update_user_field($email, 'name', $value);
            break;
        
        case 'password':
            if (isset($_POST['current_password'])) {
                $current_password = $_POST['current_password'];
                if (!verify_user_password($email, $current_password)) {
                    echo json_encode([
                        "status" => "error",
                        "message" => "Current password is incorrect"
                    ]);
                    exit;
                }
            }
            
            $hashedPassword = password_hash($value, PASSWORD_DEFAULT);
            $result = update_user_field($email, 'password', $hashedPassword);
            break;
        
        case 'cin':
            $result = update_user_field($email, 'cin', $value);
            break;
        
        case 'licence':
            $result = update_user_field($email, 'licence', $value);
            break;
        
        case 'photo':
            $result = update_user_field($email, 'photo', $value);
            break;
            
        case 'phone':
            $result = update_user_field($email, 'phone', $value);
            break;
            
        case 'address':
            $result = update_user_field($email, 'address', $value);
            break;
            
        case 'birthDate':
            $result = update_user_field($email, 'birth', $value);
            break;
            
        default:
            echo json_encode([
                "status" => "error",
                "message" => "Invalid field: $field"
            ]);
            exit;
    }

    if ($result) {
        echo json_encode([
            "status" => "success",
            "message" => "$field updated successfully"
        ]);
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Failed to update $field"
        ]);
    }
} else {
    if (!$email) {
        echo json_encode([
            "status" => "error",
            "message" => "Not logged in"
        ]);
        exit;
    }

    $user_data = get_user_data($email);
    
    if ($user_data) {
        echo json_encode($user_data);
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "User not found"
        ]);
    }
}
?>