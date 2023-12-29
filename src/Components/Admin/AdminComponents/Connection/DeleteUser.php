<?php
session_start();

header("Access-Control-Allow-Origin: https://scannerst.pro/");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Return appropriate headers for preflight requests
    header("HTTP/1.1 200 OK");
    exit();
}

// Retrieve JSON data from the request
$data = json_decode(file_get_contents('php://input'), true);

// Check if barcode data is present
if (isset($data['selectedUser'])) {
    $user = $data['selectedUser'];
    $userId = $user['userId'];

    // Connect to the database (replace with your database credentials)
    $servername = 'localhost:3306';
    $username = 'scanners_root';
    $password = 'Zcjqf6679xk2';
    $dbname = 'scanners_stocktaken';

    try {
        $conn = new mysqli($servername, $username, $password, $dbname);
    
        if ($conn->connect_error) {
            throw new Exception('Connection failed: ' . $conn->connect_error);
        }
    
        // Use prepared statement to delete user
        $deleteUser = $conn->prepare("DELETE FROM users WHERE user_id = ?");
        $deleteUser->bind_param("i", $userId); // Assuming user_id is an integer, adjust the type if it's different
        $deleteUser->execute();
    
        $response = ['status' => 'success', 'message' => 'User Deleted Successfully'];
        $deleteUser->close();
    
    } catch (Exception $e) {
        $response = ['status' => 'error', 'message' => $e->getMessage()];
    } finally {
        if (isset($conn)) {
            $conn->close();
        }
    }
    
} else {
    $response = ['status' => 'error', 'message' => 'User data not provided'];
}

echo json_encode($response);
?>
