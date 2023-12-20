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
if (isset($data['selectedBarcode'], $data['action'])) {
    $barcode = $data['selectedBarcode'];
    $action = $data['action'];

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

    if($action === 'DeleteOnce'){
        // Check if the barcode is already associated with any user
        $checkSql = "SELECT id_column, qty as mqty FROM barcodes WHERE barcode = ? AND qty>0 GROUP BY barcode";
        $stmt = $conn->prepare($checkSql);
        $stmt->bind_param('s', $barcode);
        $stmt->execute();
        $checkResult = $stmt->get_result();
        $checkqty = $checkResult->fetch_assoc();
        $qty = $checkqty['mqty'];
        $bar_id = $checkqty['id_column'];

        $updatesql = "UPDATE barcodes SET qty=? WHERE id_column = ? AND qty>0";
        $stmt = $conn->prepare($updatesql);
        $newQty = $qty - 1;
        $stmt->bind_param('ii', $newQty, $bar_id);

        if ($stmt->execute()) {
            $response = ['status' => 'success', 'message' => 'New Qty: ' . $newQty];
        } else {
            $response = ['status' => 'error', 'message' => 'Error Deleting one barcode: ' . $stmt->error];
        }



    } elseif($action === 'DeleteBarcode'){
        $deletesql = "DELETE FROM barcodes WHERE barcode=?";
        $stmt = $conn->prepare($deletesql);
        $stmt->bind_param('s', $barcode);

        if ($stmt->execute()) {
            $response = ['status' => 'success'];
        } else {
            $response = ['status' => 'error', 'message' => 'Error Deleting Full barcode: ' . $stmt->error];
        }
    }
    $stmt->close();
    $conn->close();
} else {
    $response = ['status' => 'error', 'message' => 'Barcode data not provided'];
}

echo json_encode($response);
?>
