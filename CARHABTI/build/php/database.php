<?php
    file_put_contents("debug.txt", "Database script loaded\n", FILE_APPEND);

    $db_host = 'localhost';
    $db_user = 'root';
    $db_pass = '';
    $db_name = 'carhabti';
    $db_port = 3306; 

    try{
        file_put_contents("debug.txt", "Attempting database connection\n", FILE_APPEND);
        $conn = mysqli_connect($db_host, $db_user, $db_pass, $db_name, $db_port);
        if (!$conn) {
            file_put_contents("debug.txt", "Connection failed: " . mysqli_connect_error() . "\n", FILE_APPEND);
            die("Connection failed: " . mysqli_connect_error());
        }
        file_put_contents("debug.txt", "Database connection successful\n", FILE_APPEND);
    }
    catch (mysqli_sql_exception $e) {
        file_put_contents("debug.txt", "Connection exception: " . $e->getMessage() . "\n", FILE_APPEND);
        echo "Connection failed: " . $e->getMessage();
    }

    function get_emails() {
        global $conn;
        file_put_contents("debug.txt", "get_emails function called\n", FILE_APPEND);
        $emails = array();
        $query = "SELECT email FROM account";
        $result = $conn->query($query);
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $emails[] = $row['email'];
            }
        }
        file_put_contents("debug.txt", "get_emails returned " . count($emails) . " emails\n", FILE_APPEND);
        return $emails;
    }

    function get_user_data($email) {
        global $conn;
        file_put_contents("debug.txt", "get_user_data function called for email: {$email}\n", FILE_APPEND);
        $query = "SELECT * FROM account WHERE email = ?";
        $stmt = $conn->prepare($query);
        if (!$stmt) {
            file_put_contents("debug.txt", "Prepare failed: " . $conn->error . "\n", FILE_APPEND);
            return null;
        }
        $stmt->bind_param("s", $email);
        if (!$stmt->execute()) {
            file_put_contents("debug.txt", "Execute failed: " . $stmt->error . "\n", FILE_APPEND);
            return null;
        }
        $result = $stmt->get_result();
        if ($result->num_rows > 0) {
            $userData = $result->fetch_assoc();
            file_put_contents("debug.txt", "User found with ID: " . $userData['id'] . "\n", FILE_APPEND);
            return $userData;
        } else {
            file_put_contents("debug.txt", "No user found with email: {$email}\n", FILE_APPEND);
            return null;
        }
    }

    function update_user_photo($email , $photo){
        global $conn;
        $query = "UPDATE account SET photo = ? WHERE email = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("ss", $photo, $email);
        if ($stmt->execute()) {
            return true;
        } else {
            return false;
        }
    }
    function update_user_password($email , $password){
        global $conn;
        $query = "UPDATE account SET password = ? WHERE email = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("ss", $password, $email);
        if ($stmt->execute()) {
            return true;
        } else {
            return false;
        }
    }
    function update_user_name($email , $name){
        global $conn;
        $query = "UPDATE account SET name = ? WHERE email = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("ss", $name, $email);
        if ($stmt->execute()) {
            return true;
        } else {
            return false;
        }
    }
    function update_user_cin($email , $cin){
        global $conn;
        $query = "UPDATE account SET id = ? WHERE email = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("ss", $cin, $email);
        if ($stmt->execute()) {
            return true;
        } else {
            return false;
        }
    }
    function update_user_licence ($email , $licence){
        global $conn;
        $query = "UPDATE account SET licence = ? WHERE email = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("ss", $licence, $email);
        if ($stmt->execute()) {
            return true;
        } else {
            return false;
        }
    }
?>