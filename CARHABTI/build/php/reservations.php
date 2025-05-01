<?php
require 'database.php';
header('Content-Type: application/json');

try {
    if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        $data = json_decode(file_get_contents('php://input'), true);
        if (!isset($data['email']) || !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            throw new Exception("Valid email is required");
        }
        $email = $data['email'];
        if (delete_user($email)) {
            echo json_encode(['success' => true, 'message' => 'User deleted successfully']);
        } else {
            throw new Exception("Failed to delete user");
        }
    } else if ($_SERVER['REQUEST_METHOD'] === 'PATCH') {
        $data = json_decode(file_get_contents('php://input'), true);
        if (!isset($data['email']) || !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            throw new Exception("Valid email is required");
        }
        $email = $data['email'];
        $user = get_user_data($email);
        if (!$user) {
            throw new Exception("User not found");
        }
        $newAdminStatus = $user['admin'] ? 0 : 1;
        if (update_user_field($email, 'admin', $newAdminStatus)) {
            echo json_encode(['success' => true, 'message' => 'Admin status updated']);
        } else {
            throw new Exception("Failed to update admin status");
        }
    } else if (isset($_GET['users']) && $_GET['users'] === 'true') {
        $sql = "SELECT email, name, phone, address, birth, cin, licence, admin FROM account";
        $result = $conn->query($sql);
        $users = [];
        
        if ($result) {
            while ($row = $result->fetch_assoc()) {
                $row['admin'] = (int) $row['admin'];
                $users[] = $row;
            }
            $result->free();
            echo json_encode(['success' => true, 'users' => $users]);
        } else {
            throw new Exception("Error fetching users: " . $conn->error);
        }
    } else if (isset($_GET['allReservations']) && $_GET['allReservations'] === 'true') {
        $reservations = get_all_reservations();
        echo json_encode([
            'success' => true,
            'array' => $reservations
        ]);
    } else if (isset($_GET['email'])) {
        $email = filter_var($_GET['email'], FILTER_SANITIZE_EMAIL);
        if (!$email) {
            throw new Exception("Invalid email format");
        }

        $reservations = get_reservations_by_email($email);
        echo json_encode([
            'success' => true,
            'array' => $reservations
        ]);
    } else {
        throw new Exception("Email parameter is required");
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>