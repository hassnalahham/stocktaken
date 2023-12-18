<?php
session_start();

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

// Retrieve JSON data from the request
$data = json_decode(file_get_contents('php://input'), true);

// Check if barcode data is present
if (isset($data['barcode'])) {
    $barcode = $data['barcode'];
    $userId = $_SESSION['userId'];
    // Connect to the database (replace with your database credentials)
    $servername = 'localhost:3306';
    $username = 'root';
    $password = '';
    $dbname = 'stocktaken';

    $conn = new mysqli($servername, $username, $password, $dbname);

    // Check connection
    if ($conn->connect_error) {
        die('Connection failed: ' . $conn->connect_error);
    }

    $sql = "SELECT * FROM users WHERE user_id='". $_SESSION['userId']  ."'";
    $result = $conn->query($sql);
    $user = $result->fetch_assoc();
    $status = $user['status'];


    if($status === "Active"){
        // Barcode does not exist, insert new row with quantity 1
        $insertSql = "INSERT INTO barcodes (barcode, user_id) VALUES ('$barcode', '$userId')";
        if ($conn->query($insertSql) === TRUE) {
            $response = ['status' => 'success', 'message' => 'New barcode inserted with quantity 1'];
        } else {
            $response = ['status' => 'error', 'message' => 'Error inserting new barcode: ' . $conn->error];
        }
    }else{
        $response = ['status' => 'error', 'message' => 'Account Not Active'];
    }

       
    

    $conn->close();
} else {
    $response = ['status' => 'error', 'message' => 'Barcode data not provided'];
}

echo json_encode($response);
?>
