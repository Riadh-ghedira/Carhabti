<?php
ob_start();
session_start();


$_SESSION = array();

session_destroy();

ob_end_clean();
header('Content-Type: application/json');
echo json_encode(["status" => "success", "message" => "Logged out successfully"]);
exit;
?>