<?php

    $db_host = 'localhost';
    $db_user = 'root';
    $db_pass = '';
    $db_name = 'carhabti';
    $db_port = 3307; 


    
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
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($result->num_rows > 0) {
            return $result->fetch_assoc();
        } else {
            return null;
        }
    }
    function update_user_phot
?>