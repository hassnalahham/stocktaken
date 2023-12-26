<?php
session_start();

header("Access-Control-Allow-Origin: https://scannerst.pro/");
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
    $sessionData = $_SESSION['SessionName'];
    
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

    // Check if the barcode is already associated with any user
    $checkSql = "
        SELECT
            b.barcode,
            SUM(b.qty) AS current_qty,
            MAX(ob.qty) AS origin_qty,
            SUM(b.qty) - MAX(ob.qty) AS qty_difference,
            b.user_id AS userid
        FROM
            barcodes b
        JOIN
            $sessionData ob ON b.barcode = ob.barcode
        WHERE
            b.barcode = ?
        GROUP BY
            b.barcode
        ";
        $stmt = $conn->prepare($checkSql);
        $stmt->bind_param("s", $barcode);
        $stmt->execute();
        $checkResult = $stmt->get_result();

    if ($checkResult->num_rows > 0) {
        $existingBarcode = $checkResult->fetch_assoc();
        $existingUserId = $existingBarcode['userid'];
            // Barcode already associated with a different user
            $getUserSql = "SELECT concat(first_name,' ',last_name)  as fullname FROM users WHERE user_id = '$existingUserId'";
            $getUserResult = $conn->query($getUserSql);

            if ($getUserResult->num_rows > 0) {
                $existingUser = $getUserResult->fetch_assoc();
                $existingUserName = $existingUser['fullname'];

                $barcodes = [
                    'barcode' => $existingBarcode['barcode'],
                    'qty' => $existingBarcode['current_qty'],
                    'origin_qty' => $existingBarcode['origin_qty'],  // Fix the key here
                    'qty_difference' => $existingBarcode['qty_difference'],  // Fix the key here
                    'UserFullname' => $existingUser['fullname'],
                    'userId' => $existingBarcode['userid'],
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
