<?php
include 'database.php';
session_start();

header('Content-Type: application/json');


if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["status" => "error", "message" => "Invalid request method"]);
    exit;
}

$email = htmlspecialchars(trim($_POST['email']));
$password = $_POST['password'];


if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["status" => "invalid_email", "message" => "Invalid email format"]);
    exit;
}


$user = get_user_data($email);


if ($user) {
    if (password_verify($password, $user['password'])) {
         
        $res = ["status" => "success","name" => $user['name'],"email" => $user['email'],"isAdmin" => $user['admin']];
        echo json_encode($res);
        exit;
    } else {
        echo json_encode(["status" => "invalid_password", "message" => "Invalid password"]);
        exit;
    }
} else {
    echo json_encode(["status" => "user_not_found", "message" => "User not found"]);
    exit;
}