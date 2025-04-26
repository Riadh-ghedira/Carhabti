<?php
include 'database.php';
session_start();

header('Content-Type: application/json');

$email = htmlspecialchars(trim($_POST['email']));
$password = $_POST['password'];

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["status" => "invalid_email", "message" => "Invalid email format"]);
    exit;
}

$user = get_user_data($email);
if ($user) {
    if (password_verify($password, $user['password'])) {
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['name'] = $user['name'];
        $_SESSION['email'] = $user['email'];
        $_SESSION['isAdmin'] = $user['Admin'] == 1 ? true : false;
        $_SESSION['isLoggedIn'] = true;
        
        echo json_encode([
            "status" => "success",
            "name" => $user['name'],
            "email" => $user['email'],
            "isAdmin" => $_SESSION['isAdmin']
        ]);
        exit;
    } else {
        echo json_encode(["status" => "invalid_password", "message" => "Invalid password"]);
        exit;
    }
} else {
    echo json_encode(["status" => "user_not_found", "message" => "User not found"]);
    exit;
}
?>