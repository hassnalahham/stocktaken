<?php
session_start();

header("Access-Control-Allow-Origin: http://localhost:3000");
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
if (isset($data['CreateSession'])) {
    $user = $data['CreateSession'];
    $sessionName = $user['SessionName'];
    $user_id = $_SESSION['userId'];
    $account_id = $_SESSION['accountId'];
    $status = 'Active';
    $current_date = date("Y-m-d H:i:s");

    // Connect to the database (replace with your database credentials)
    $servername = 'localhost';
    $username = 'root';
    $password = '';
    $dbname = 'stocktaken';

    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        die('Connection failed: ' . $conn->connect_error);
    }

    // Check if a matching user already exists
    $sql = "SELECT * FROM sessions WHERE session_name='$sessionName'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $response = ['status' => 'error', 'message' => 'Session Name already in use'];
    } else {
        // Insert the new user
        $updatesql = "INSERT INTO sessions (session_name, account_id, user_id, create_time, status) VALUES (?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($updatesql);
        $stmt->bind_param('siiss', $sessionName, $account_id, $user_id, $current_date, $status);

        if ($stmt->execute()) {
            // Create a new table with barcode and qty columns
            $createTableSQL = "CREATE TABLE $sessionName (
                                barcode VARCHAR(255) NOT NULL,
                                qty INT NOT NULL,
                                PRIMARY KEY (barcode)
                              )";
            $conn->query($createTableSQL);

            $response = ['status' => 'success', 'message' => 'New Session Created Successfully: ' . $sessionName];
            $stmt->close();
        } else {
            $response = ['status' => 'error', 'message' => 'Error Creating Session: ' . $stmt->error];
        }
    }

    $conn->close();
} else {
    $response = ['status' => 'error', 'message' => 'Session data not provided'];
}

echo json_encode($response);
?>
