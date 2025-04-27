<?php
ob_start();
session_start();
header('Content-Type: application/json');
echo json_encode(["isLoggedIn" => isset($_SESSION['isLoggedIn']) && $_SESSION['isLoggedIn']]);
ob_end_clean();
exit;
