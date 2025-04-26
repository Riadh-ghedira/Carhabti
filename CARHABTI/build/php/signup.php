<?php
include 'database.php';

if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST['submit'])) {
    $name = htmlspecialchars(trim($_POST['name']));
    $email = htmlspecialchars(trim($_POST['email']));
    $password = $_POST['password'];
    $confirmPassword = $_POST['confirmpassword'];

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        header("Location: signup.html?status=error");
        exit;
    }

    if (strlen($password) < 8 || !preg_match('/[A-Z]/', $password) || !preg_match('/[0-9]/', $password)) {
        header("Location: signup.html?status=error");
        exit;
    }

    if ($password !== $confirmPassword) {
        header("Location: signup.html?status=error");
        exit;
    }

    if (in_array($email, get_emails())) {
        header("Location: signup.html?status=error");
        exit;
    }
    $stmt->close();

    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $conn->prepare("INSERT INTO account (name, email, password) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $name, $email, $hashedPassword);

    if ($stmt->execute()) {
        header("Location: signup.html?status=success");
        exit;
    } else {
        header("Location: signup.html?status=error");
        exit;
    }

    $stmt->close();
    $conn->close();
    
}
?>
