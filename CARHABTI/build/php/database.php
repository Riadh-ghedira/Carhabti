<?php
$db_host = 'localhost';
$db_user = 'root';
$db_pass = '';
$db_name = 'carhabti';
$db_port = 3306;

try {
    $conn = mysqli_connect($db_host, $db_user, $db_pass, $db_name, $db_port);
    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }
} catch (mysqli_sql_exception $e) {
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
    
    $sql = "SELECT * FROM account WHERE email = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        return $user; 
    }
    
    return null;
}

function update_user_field($email, $field, $value) {
    global $conn;
    
    $sql = "UPDATE account SET $field = ? WHERE email = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $value, $email);
    return $stmt->execute();
}

function verify_user_password($email, $password) {
    global $conn;
    
    $sql = "SELECT password FROM account WHERE email = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        return password_verify($password, $user['password']);
    }
    
    return false;
}
function get_car_data(){
    global $conn;
    $cars = array();
    $query = "SELECT * FROM car";
    $result = $conn->query($query);
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $cars[] = $row;
        }
    }
    return $cars;
}
function update_car_field($car_id, $field, $value) {
    global $conn;
    
    $sql = "UPDATE car SET $field = ? WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("si", $value, $car_id);
    return $stmt->execute();
}
function get_car_by_id($car_id) {
    global $conn;
    
    $sql = "SELECT * FROM car WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $car_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        return $result->fetch_assoc(); 
    }
    
    return null;
}
?>