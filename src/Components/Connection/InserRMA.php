<?php
session_start();

header("Access-Control-Allow-Origin: https://scannerst.pro/");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

// Retrieve JSON data from the request
$data = json_decode(file_get_contents('php://input'), true);

// Check if session data exists
if (!isset($_SESSION['SessionName'])) {
    $response = ['status' => 'error', 'message' => 'No Session Started yet'];
    echo json_encode($response);
    exit;
}

// Check if barcode data is present
if (isset($data['barcode'])) {
    $barcode = $data['barcode'];
    $rma = $data['RMA'];
    $userId = $_SESSION['userId'];
    $sessionData = $_SESSION['SessionName'];
    $sessionDataRMA = $_SESSION['SessionNameRMA'];
    $qty = isset($data['quantity']) ? $data['quantity'] : 1;

    // Connect to the database (replace with your database credentials)
    $servername = 'localhost:3306';
    $username = 'scanners_root';
    $password = 'Zcjqf6679xk2';
    $dbname = 'scanners_stocktaken';

    $conn = new mysqli($servername, $username, $password, $dbname);

    // Check connection
    if ($conn->connect_error) {
        die('Connection failed: ' . $conn->connect_error);
    }

    // Check if barcode and RMA Correct 
    $checkSessionTable = "SELECT * FROM $sessionDataRMA WHERE barcode = '$barcode' AND rma = '$rma' ";
    $checkSessionResult = $conn->query($checkSessionTable);
    if ($checkSessionResult->num_rows == 0) {
        $response = ['status' => 'error', 'message' => 'Check inserted Barcode or RMA'];
        echo json_encode($response);
        exit;
    }else{
        // Check if barcode and RMA already added 
        $checkSessionTable = "SELECT * FROM barcodes WHERE barcode = '$barcode'";
        $checkSessionResult = $conn->query($checkSessionTable);
        if ($checkSessionResult->num_rows > 0) {
                $row = $checkSessionResult->fetch_assoc();
                $insertedUserId = $row['user_id'];
                $insertedRMA = $row['rma'];
            if($insertedUserId != $userId) {
                $getUserSql = "SELECT concat(first_name,' ',last_name)  as fullname FROM users WHERE user_id = '$insertedUserId'";
                $getUserResult = $conn->query($getUserSql);
                if ($getUserResult->num_rows > 0) {
                    $existingUser = $getUserResult->fetch_assoc();
                    $existingUserName = $existingUser['fullname'];
                    $response = ['status' => 'error', 'message' => "This barcode is already associated with $existingUserName."];
                } else {
                    $response = ['status' => 'error', 'message' => 'Error retrieving user information: ' . $conn->error];
                }
            }elseif($insertedRMA ==  $rma){
                    $response = ['status' => 'error', 'message' => 'RMA already Exist'];
                    echo json_encode($response);
                    $conn->close();
                    exit;
            }elseif ($insertedUserId == $userId) {
                $insertSql = "INSERT INTO barcodes (barcode, qty, user_id, rma) VALUES ('$barcode', $qty, '$userId', '$rma')";
                if ($conn->query($insertSql) === TRUE) {
                    $response = ['status' => 'success', 'message' => 'New barcode inserted with RMA "'. $rma .'"'];
                } else {
                    $response = ['status' => 'error', 'message' => 'Error inserting new barcode: ' . $conn->error];
                }
            }else {
                $response = ['status' => 'error', 'message' => 'Unexpected error occurred'];
                echo json_encode($response);
                exit;
            }
            
        }else{
                $insertSql = "INSERT INTO barcodes (barcode, qty, user_id, rma) VALUES ('$barcode', $qty, '$userId', '$rma')";
                if ($conn->query($insertSql) === TRUE) {
                    $response = ['status' => 'success', 'message' => 'New barcode inserted with RMA "'. $rma .'"'];
                } else {
                    $response = ['status' => 'error', 'message' => 'Error inserting new barcode: ' . $conn->error];
                }
        }
    }
    $conn->close();
} else {
    $response = ['status' => 'error', 'message' => 'Barcode data not provided'];
}


echo json_encode($response);
?>
