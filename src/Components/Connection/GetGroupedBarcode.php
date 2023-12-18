<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

// Replace these with your actual database credentials
    $servername = 'localhost';
    $username = 'root';
    $password = '';
    $dbname = 'stocktaken';

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die('Connection failed: ' . $conn->connect_error);
}

// Run a query to get the latest barcodes
$sql = "SELECT * FROM barcodes GROUP BY barcode"; // Updated the ORDER BY clause
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $barcodes = array();
    while ($row = $result->fetch_assoc()) {
        $barcodes[] = $row['barcode'];
    }

    echo json_encode($barcodes);
} else {
    echo json_encode(array()); // Return an empty array if no barcodes are found
}

$conn->close();
?>
