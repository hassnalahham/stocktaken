<?php
session_start();

header("Access-Control-Allow-Origin: https://scannerst.pro/");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

ini_set('memory_limit', '256M'); // Set the memory limit to 256 megabytes (adjust as needed)

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Return appropriate headers for preflight requests
    header("HTTP/1.1 200 OK");
    exit();
}

// Check if barcode data is present
if (isset($_FILES['SessionFile'])) {
    try {
        $sessionName = $_SESSION['SessionName'];
        $sessionFile = $_FILES['SessionFile'];
        $user_id = $_SESSION['userId'];
        $account_id = $_SESSION['accountId'];
        $sessionRMA = $sessionName . 'rma';

        // Connect to the database (replace with your database credentials)
        $servername = 'localhost:3306';
        $username = 'scanners_root';
        $password = 'Zcjqf6679xk2';
        $dbname = 'scanners_stocktaken';

        $conn = new mysqli($servername, $username, $password, $dbname);

        if ($conn->connect_error) {
            throw new Exception('Connection failed: ' . $conn->connect_error);
        }

        // Check if a matching session already exists
        $sqlc = "SELECT * FROM sessions WHERE session_name='$sessionName' AND session_rma='$sessionRMA'";
        $resultc = $conn->query($sqlc);

        if ($resultc->num_rows < 1) {
            echo json_encode(['success' => false, 'message' => 'Error While Inserting']);
            $resultc->close(); // Close the result set
            $conn->close();
            exit();
        } else {
                // Insert data from the CSV file
                $csvFile = fopen($sessionFile['tmp_name'], 'r');

                if (!$csvFile) {
                    throw new Exception('Error opening CSV file');
                }

                while (($data = fgetcsv($csvFile, 0, ',')) !== false) {
                    $barcode = $data[0];
                    $qty = $data[1];
                    $insertDataSQL = "INSERT INTO $sessionRMA (barcode, rma) VALUES (?, ?)";
                    $insertStmt = $conn->prepare($insertDataSQL);
                    $insertStmt->bind_param('ss', $barcode, $qty);

                    if ($insertStmt->execute()) {
                        echo "Row inserted successfully: Barcode=$barcode, RMA=$qty<br>";
                    } else {
                        echo "Error inserting row: " . $insertStmt->error . "<br>";
                        $conn->rollback(); // Roll back the transaction on error
                        break; // Exit the loop on error
                    }

                    // Free the memory occupied by the prepared statement
                    $insertStmt->close();
                }

                fclose($csvFile);
                $conn->commit(); // Commit the transaction
                echo json_encode(['success' => true]);
        }
        $resultc->close();
        $conn->close();
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
        http_response_code(500); // Internal Server Error
        exit();
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Session data not provided']);
    http_response_code(400); // Bad Request
    exit();
}
exit();
?>
