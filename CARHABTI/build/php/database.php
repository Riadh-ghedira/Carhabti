<?php
    $db_host = 'localhost';
    $db_user = 'root';
    $db_pass = '';
    $db_name = 'carhabti';
    $db_port = 3306; 

    try{
        
        $conn = mysqli_connect($db_host, $db_user, $db_pass, $db_name, $db_port);
        if (!$conn) {
            die("Connection failed: " . mysqli_connect_error());
        }
        
    }
    catch (mysqli_sql_exception $e) {
        echo "Connection failed: " . $e->getMessage();
    }

    function get_emails() {
        global $conn;
        $emails = array();
        $query = "SELECT email FROM account";
        $result = $conn->query($query);
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $emails[] = $row['email'];
            }
        }
        return $emails;
    }

    function get_user_data($email) {
        global $conn;
        $query = "SELECT * FROM account WHERE email = ?";
        $stmt = $conn->prepare($query);
        if (!$stmt) {

            return null;
        }
        $stmt->bind_param("s", $email);
        if (!$stmt->execute()) {
            return null;
        }
        $result = $stmt->get_result();
        if ($result->num_rows > 0) {
            $userData = $result->fetch_assoc();
            return $userData;
        } else {
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