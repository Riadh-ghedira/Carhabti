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
        save_to_session($email, $user['name'], $user['admin']);
        exit;
    } else {
        echo json_encode(["status" => "invalid_password", "message" => "Invalid password"]);
        exit;
    }
} else {
    echo json_encode(["status" => "user_not_found", "message" => "User not found"]);
    exit;
}
function save_to_session($email, $name, $isAdmin) {
    $_SESSION['isLoggedIn'] = true;
    $_SESSION['email'] = $email;
    $_SESSION['name'] = $name;
    $_SESSION['isAdmin'] = $isAdmin;
    setcookie('localStorageEmail', $email, time() + (86400 * 30), "/"); // 86400 = 1 day
}