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

// Check if barcode data is present
if (isset($_SESSION['SessionName'])) {
    
    $sessionName = $_SESSION['SessionName'];
    $user_id = $_SESSION['userId'];
    $account_id = $_SESSION['accountId'];
    $status = 'Deactivate';

    // Connect to the database (replace with your database credentials)
    $servername = 'localhost:3306';
    $username = 'scanners_root';
    $password = 'Zcjqf6679xk2';
    $dbname = 'scanners_stocktaken';

    try {
        $conn = new mysqli($servername, $username, $password, $dbname);

        if ($conn->connect_error) {
            throw new Exception('Connection failed: ' . $conn->connect_error);
        }

        // Insert the new user
        $updatesql = "UPDATE sessions SET status=? , enduser_id=? WHERE session_name= ? AND account_id= ?";
        $stmt = $conn->prepare($updatesql);
        $stmt->bind_param('sisi', $status, $user_id, $sessionName, $account_id);

        if ($stmt->execute()) {
            // Create a new table with barcode and qty columns
            $deletetable = "DROP TABLE " . mysqli_real_escape_string($conn, $sessionName);
            $conn->query($deletetable);

            $response = ['status' => 'success', 'message' => 'Session End Successfully'];
            $stmt->close();
        } else {
            throw new Exception('Error Ending Session: ' . $stmt->error);
        }
    } catch (Exception $e) {
        $response = ['status' => 'error', 'message' => $e->getMessage()];
    } finally {
        if (isset($conn)) {
            $conn->close();
        }
    }
} else {
    $response = ['status' => 'error', 'message' => 'Session data not provided'];
}

echo json_encode($response);
?>
