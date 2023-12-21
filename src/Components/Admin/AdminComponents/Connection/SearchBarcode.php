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
    $servername = 'localhost';
    $username = 'root';
    $password = '';
    $dbname = 'stocktaken';

    $conn = new mysqli($servername, $username, $password, $dbname);

    // Check connection
    if ($conn->connect_error) {
        die('Connection failed: ' . $conn->connect_error);
    }

    // Check if the barcode is already associated with any user
    $checkSql = "SELECT * , sum(qty) as sqty FROM barcodes WHERE barcode = '$barcode' GROUP BY barcode";
    $checkResult = $conn->query($checkSql);

    if ($checkResult->num_rows > 0) {
        $existingBarcode = $checkResult->fetch_assoc();
        $existingUserId = $existingBarcode['user_id'];
            // Barcode already associated with a different user
            $getUserSql = "SELECT concat(first_name,' ',last_name)  as fullname FROM users WHERE user_id = '$existingUserId'";
            $getUserResult = $conn->query($getUserSql);

            if ($getUserResult->num_rows > 0) {
                $existingUser = $getUserResult->fetch_assoc();
                $existingUserName = $existingUser['fullname'];

                $barcodes = [
                    'barcode' => $existingBarcode['barcode'],
                    'qty' => $existingBarcode['sqty'],
                    'UserFullname' => $existingUser['fullname'],
                ];

                $response = ['success' => true, 'user' => $barcodes];
                
            } else {
                $response = ['status' => 'error', 'message' => 'Error retrieving user information: ' . $conn->error];
            }
    }
    else{
       $response = ['status' => 'error', 'message' => 'Barcode not added yet'];
    }
    $conn->close();
} else {
    $response = ['status' => 'error', 'message' => 'Barcode data not provided'];
}

echo json_encode($response);
?>
