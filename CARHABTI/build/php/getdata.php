<?php
 include_once 'database.php';

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
 
?>