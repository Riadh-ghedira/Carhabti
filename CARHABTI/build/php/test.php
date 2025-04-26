<?php
// Create this as test-password.php and run it to test password verification
include 'database.php';

$email = "johndoe@example.com"; // Replace with a known email in your database
$testPassword = "password123"; // Replace with what you think is the password

file_put_contents("password-debug.txt", "Testing password for email: {$email}\n", FILE_APPEND);

$user = get_user_data($email);
if ($user) {
    file_put_contents("password-debug.txt", "User found. Stored password hash: " . $user['password'] . "\n", FILE_APPEND);
    
    // Test if password is hashed properly
    if (strlen($user['password']) < 20) {
        file_put_contents("password-debug.txt", "WARNING: Password appears to be stored in plain text or weak hash\n", FILE_APPEND);
    }
    
    // Verify password
    $result = password_verify($testPassword, $user['password']);
    file_put_contents("password-debug.txt", "Password verification result: " . ($result ? "MATCH" : "NO MATCH") . "\n", FILE_APPEND);
    
    // Hash info
    $info = password_get_info($user['password']);
    file_put_contents("password-debug.txt", "Hash info: " . print_r($info, true) . "\n", FILE_APPEND);
} else {
    file_put_contents("password-debug.txt", "No user found with email: {$email}\n", FILE_APPEND);
}

echo "Test complete. Check password-debug.txt for results.";
?>