<?php
include 'database.php';

if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST['submit'])) {
    $name = htmlspecialchars(trim($_POST['name']));
    $email = htmlspecialchars(trim($_POST['email']));
    $password = $_POST['password'];
    $confirmPassword = $_POST['confirmpassword'];

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(["status" => "invalid_email", "message" => "Invalid email format"]);
        exit;
    }

    if (strlen($password) < 8 || !preg_match('/[A-Z]/', $password) || !preg_match('/[0-9]/', $password)) {
        echo json_encode(["status" => "invalid_password", "message" => "Invalid password"]);
        exit;
    }

    if ($password !== $confirmPassword) {
        echo json_encode(["status" => "invalid_confi_password", "message" => "Invalid comfirmation password"]);
        exit;
    }

    if (in_array($email, get_emails())) {
        echo json_encode(["status" => "invalid_email", "message" => "user already exists"]);
        exit;
    }
    $stmt->close();

    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $conn->prepare("INSERT INTO account (name, email, password) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $name, $email, $hashedPassword);

    if ($stmt->execute()) {
        $res = ["status" => "success","name" => $user['name'],"email" => $user['email'],"isAdmin" => $_SESSION['isAdmin']];
        echo json_encode($res);
        exit;
    } else {
        echo json_encode(["status" => "Server_error", "message" => "Server error"]);
        exit;
    }

    $stmt->close();
    $conn->close();
    
}
?>
