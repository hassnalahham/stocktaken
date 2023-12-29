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
} else if (!isset($_SESSION['SessionNameRMA'])) {
    $response = ['status' => 'error', 'message' => 'No Session Started yet RMA'];
    echo json_encode($response);
    exit;
} else if (isset($data['barcode'])) { // Check if barcode data is present
    $barcode = $data['barcode'];
    $userId = $_SESSION['userId'];
    $qty = isset($data['quantity']) ? $data['quantity'] : 1;
    $sessionData = $_SESSION['SessionName'];
    $sessionDataRMA = $_SESSION['SessionNameRMA'];

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

    $checkSessionTable = "SELECT * FROM $sessionDataRMA WHERE barcode = '$barcode'";
    $checkSessionResult = $conn->query($checkSessionTable);
    if ($checkSessionResult->num_rows > 0) {
        $response = ['status' => 'error', 'message' => 'Use RMA button to Scan RMA items'];
        echo json_encode($response);
        exit;
    }



    $checkSessionTable = "SELECT * FROM $sessionData WHERE barcode = '$barcode'";
    $checkSessionResult = $conn->query($checkSessionTable);
    if ($checkSessionResult->num_rows > 0) {
        $checkSql = "SELECT * FROM barcodes WHERE barcode = '$barcode'";
        $checkResult = $conn->query($checkSql);
    
        if ($checkResult->num_rows > 0) {
            $existingBarcode = $checkResult->fetch_assoc();
            $existingUserId = $existingBarcode['user_id'];
    
            if ($existingUserId !== $userId) {
                // Barcode already associated with a different user
                $getUserSql = "SELECT concat(first_name,' ',last_name)  as fullname FROM users WHERE user_id = '$existingUserId'";
                $getUserResult = $conn->query($getUserSql);
    
                if ($getUserResult->num_rows > 0) {
                    $existingUser = $getUserResult->fetch_assoc();
                    $existingUserName = $existingUser['fullname'];
                    $response = ['status' => 'error', 'message' => "This barcode is already associated with $existingUserName."];
                } else {
                    $response = ['status' => 'error', 'message' => 'Error retrieving user information: ' . $conn->error];
                }
            }
         
         if ($existingUserId === $userId) {
                $insertSql = "INSERT INTO barcodes (barcode, qty, user_id) VALUES ('$barcode', $qty, '$userId')";
                if ($conn->query($insertSql) === TRUE) {
                    $response = ['status' => 'success', 'message' => 'New barcode inserted with quantity "'. $qty .'"'];
                } else {
                    $response = ['status' => 'error', 'message' => 'Error inserting new barcode: ' . $conn->error];
                }
            }
        }
        else{
             $insertSql = "INSERT INTO barcodes (barcode, qty, user_id) VALUES ('$barcode', $qty, '$userId')";
             if ($conn->query($insertSql) === TRUE) {
                 $response = ['status' => 'success', 'message' => 'New barcode inserted with quantity "'. $qty .'" '];
             } else {
                 $response = ['status' => 'error', 'message' => 'Error inserting new barcode: ' . $conn->error];
             }
        }
    $conn->close();
    }
    else{
        $response = ['status' => 'error', 'message' => 'Check the inserted barcode'];
    }
} else {
    $response = ['status' => 'error', 'message' => 'Barcode data not provided'];
}


echo json_encode($response);
?>
