<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

// Start the session
session_start();

// Check if the user is logged in
if (isset($_SESSION['isLoggedIn']) && $_SESSION['isLoggedIn'] === true) {
    // User is logged in, return user information
    $conn = new mysqli('localhost:3306', 'root', '', 'stocktaken');

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $sql = "SELECT * FROM barcodes WHERE user_id = '". $_SESSION['userId'] ."' ";
    $result = $conn->query($sql);

    $sql2 = "SELECT * FROM barcodes WHERE user_id = '". $_SESSION['userId'] ."' GROUP BY barcode ";
    $result2 = $conn->query($sql2);

    // Initialize values
    $scannedCount = 0;
    $uniqueCount = 0;

    // Check if a matching user was found
    if ($result->num_rows > 0) {
        $scannedCount = $result->num_rows;
    }

    // Check if there are unique rows
    if ($result2->num_rows > 0) {
        $uniqueCount = $result2->num_rows;
    }

    $userInfo = [
        'firstName' => $_SESSION['firstName'],
        'lastName' => $_SESSION['lastName'],
        'roll' => $_SESSION['roll'],
        'status' => $_SESSION['status'],
        'scanned' => $scannedCount,
        'unique' => $uniqueCount,
    ];

    echo json_encode(['success' => true, 'user' => $userInfo]);
} else {
    // User is not logged in
    echo json_encode(['success' => false, 'message' => 'User not logged in']);
}
?>
