<?php
// Create this as test-password.php and run it to test password verification
include 'database.php';

$email = "admin@admin.car"; // Replace with a known email in your database
$testPassword = "Admin2222"; // Replace with what you think is the password

$hash = password_hash($testPassword, PASSWORD_DEFAULT);
update_user_password($email, $hash); // Update the password in the database for testing
echo "Password hash for testing: " . $hash . "<br>";


?>