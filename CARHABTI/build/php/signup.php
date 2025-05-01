<?php
ob_start();
session_start();
header('Content-Type: application/json');

include 'database.php';

if (!function_exists('get_emails')) {
    function get_emails() {
        global $conn;
        $emails = [];
        $result = $conn->query("SELECT email FROM account");
        if ($result) {
            while ($row = $result->fetch_assoc()) {
                $emails[] = $row['email'];
            }
        }
        return $emails;
    }
}

if ($_SERVER["REQUEST_METHOD"] !== "POST" || !isset($_POST['submit'])) {
    ob_end_clean();
    echo json_encode(["status" => "error", "message" => "Invalid request method"]);
    exit;
}

if (empty($_POST['name']) || empty($_POST['email']) || empty($_POST['password']) || empty($_POST['confirmpassword'])) {
    ob_end_clean();
    echo json_encode(["status" => "error", "message" => "All fields are required"]);
    exit;
}

$name = htmlspecialchars(trim($_POST['name']));
$email = htmlspecialchars(trim($_POST['email']));
$password = $_POST['password'];
$confirmPassword = $_POST['confirmpassword'];


if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    ob_end_clean();
    echo json_encode(["status" => "error", "message" => "Invalid email format"]);
    exit;
}

if (strlen($password) < 8 || !preg_match('/[A-Z]/', $password) || !preg_match('/[0-9]/', $password)) {
    ob_end_clean();
    echo json_encode(["status" => "error", "message" => "Password must be at least 8 characters with an uppercase letter and a number"]);
    exit;
}

if ($password !== $confirmPassword) {
    ob_end_clean();
    echo json_encode(["status" => "error", "message" => "Passwords do not match"]);
    exit;
}

if (in_array($email, get_emails())) {
    ob_end_clean();
    echo json_encode(["status" => "error", "message" => "User already exists"]);
    exit;
}

$hashedPassword = password_hash($password, PASSWORD_DEFAULT);
$stmt = $conn->prepare("INSERT INTO account (name, email, password, Admin) VALUES (?, ?, ?, 0)");

if (!$stmt) {
    ob_end_clean();
    echo json_encode(["status" => "error", "message" => "Database preparation error: " . $conn->error]);
    exit;
}

$stmt->bind_param("sss", $name, $email, $hashedPassword);

if ($stmt->execute()) {
    $_SESSION['isLoggedIn'] = true;
    $_SESSION['email'] = $email;
    $_SESSION['userName'] = $name;
    $_SESSION['isAdmin'] = false;
    ob_end_clean();
    echo json_encode(["status" => "success", "name" => $name, "email" => $email, "isAdmin" => false]);
} else {
    ob_end_clean();
    echo json_encode(["status" => "error", "message" => "Server error: Unable to create account - " . $stmt->error]);
}

$stmt->close();
exit;