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
if (isset($data['CreateUser'])) {
    $user = $data['CreateUser'];
    $firstname = $user['userFirstname'];
    $lastname = $user['userLastname'];
    $roll = $user['userRoll'];
    $userusername = $user['userUsername'];
    $userpassword = $user['userPassword'];
    $status = 'Active';

    // Connect to the database (replace with your database credentials)
    $servername = 'localhost:3306';
    $username = 'scanners_root';
    $password = 'Zcjqf6679xk2';
    $dbname = 'scanners_stocktaken';

    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        die('Connection failed: ' . $conn->connect_error);
    }
    

    // Check if a matching user already exists
    $sql = "SELECT * FROM users WHERE username='$userusername'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $response = ['status' => 'error', 'message' => 'Username already in use'];
    } else {
        // Insert the new user
        $updatesql = "INSERT INTO users (first_name, last_name, username, password, roll, status) VALUES (?, ?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($updatesql);
        $stmt->bind_param('ssssss', $firstname, $lastname, $userusername, $userpassword, $roll, $status);

        if ($stmt->execute()) {
            $response = ['status' => 'success', 'message' => 'New User Created Successfully: ' . $firstname . ' ' . $lastname];
            $stmt->close();
        } else {
            $response = ['status' => 'error', 'message' => 'Error Adding User: ' . $stmt->error];
        }
    }

 
    $conn->close();
} else {
    $response = ['status' => 'error', 'message' => 'User data not provided'];
}

echo json_encode($response);
?>
