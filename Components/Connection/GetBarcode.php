<?php
session_start();
header("Access-Control-Allow-Origin: https://scannerst.pro/");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

// Replace these with your actual database credentials
    $servername = 'localhost:3306';
    $username = 'scanners_root';
    $password = 'Zcjqf6679xk2';
    $dbname = 'scanners_stocktaken';

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die('Connection failed: ' . $conn->connect_error);
}


// Check if the user is logged in
if (isset($_SESSION['isLoggedIn']) && $_SESSION['isLoggedIn'] === true) {
    // Run a query to get the latest barcodes using a prepared statement
    $sql = "SELECT barcode FROM barcodes WHERE user_id = ? ORDER BY timestamp_column DESC";

    // Prepare the statement
    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        echo json_encode(array('error' => 'Prepared statement error: ' . $conn->error));
    } else {
        // Bind the parameter
        $stmt->bind_param('i', $_SESSION['userId']); // 'i' represents an integer, adjust if needed

        // Execute the query
        $stmt->execute();

        // Check for errors in query execution
        if ($stmt->error) {
            echo json_encode(array('error' => 'Query execution error: ' . $stmt->error));
        } else {
            // Get the result
            $result = $stmt->get_result();

            if ($result->num_rows > 0) {
                $barcodes = array();
                while ($row = $result->fetch_assoc()) {
                    $barcodes[] = $row['barcode'];
                }

                echo json_encode($barcodes);
            } else {
                echo json_encode(array()); // Return an empty array if no barcodes are found
            }
        }

        // Close the statement
        $stmt->close();
    }
} else {
    echo json_encode(array('error' => 'User not logged in')); // Return an error if the user is not logged in
}

// Close the connection
$conn->close();
?>
