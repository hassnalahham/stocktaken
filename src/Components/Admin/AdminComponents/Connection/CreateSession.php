<?php
session_start();

header("Access-Control-Allow-Origin: http://localhost:3000");
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
if (isset($_POST['SessionName']) && isset($_FILES['SessionFile'])) {
    try {
        $sessionName = $_POST['SessionName'];
        $sessionFile = $_FILES['SessionFile'];
        $user_id = $_SESSION['userId'];
        $account_id = $_SESSION['accountId'];
        $status = 'Active';
        $current_date = date("Y-m-d H:i:s");

        // Connect to the database (replace with your database credentials)
        $servername = 'localhost';
        $username = 'root';
        $password = '';
        $dbname = 'stocktaken';

        $conn = new mysqli($servername, $username, $password, $dbname);

        if ($conn->connect_error) {
            throw new Exception('Connection failed: ' . $conn->connect_error);
        }

        // Check if a matching session already exists
        $sqlc = "SELECT * FROM sessions WHERE session_name='$sessionName'";
        $resultc = $conn->query($sqlc);

        if ($resultc->num_rows > 0) {
            $response = ['status' => 'error', 'message' => 'Session Name Already Exists'];
            $resultc->close(); // Close the result set
            $conn->close();
            echo json_encode($response);
            exit();
        } else {
            // Insert the new user
            $updatesql = "INSERT INTO sessions (session_name, account_id, user_id, create_time, status) VALUES (?, ?, ?, ?, ?)";
            $stmt = $conn->prepare($updatesql);
            $stmt->bind_param('siiss', $sessionName, $account_id, $user_id, $current_date, $status);

            if ($stmt->execute()) {
                // Create a new table with barcode and qty columns
                $createTableSQL = "CREATE TABLE $sessionName (
                                    column_id INT AUTO_INCREMENT  NOT NULL,
                                    barcode VARCHAR(255) NOT NULL,
                                    qty INT NOT NULL,
                                    PRIMARY KEY (column_id)
                                  )";
                $conn->query($createTableSQL);

                // Insert data from the CSV file
                $csvFile = fopen($sessionFile['tmp_name'], 'r');

                if (!$csvFile) {
                    throw new Exception('Error opening CSV file');
                }

                while (($data = fgetcsv($csvFile, 8192, ',')) !== false) {
                    $barcode = $data[0];
                    $qty = $data[1];
                    $insertDataSQL = "INSERT INTO $sessionName (barcode, qty) VALUES (?, ?)";
                    $insertStmt = $conn->prepare($insertDataSQL);
                    $insertStmt->bind_param('si', $barcode, $qty);

                    if ($insertStmt->execute()) {
                        echo "Row inserted successfully: Barcode=$barcode, Qty=$qty<br>";
                    } else {
                        echo "Error inserting row: " . $insertStmt->error . "<br>";
                        $conn->rollback(); // Roll back the transaction on error
                        break; // Exit the loop on error
                    }

                    // Free the memory occupied by the prepared statement
                    $insertStmt->close();
                }

                fclose($csvFile);

                $response = ['status' => 'success', 'message' => 'New Session Created Successfully: ' . $sessionName];
                $stmt->close();
            } else {
                $response = ['status' => 'error', 'message' => 'Error Creating Session: ' . $stmt->error];
            }
        }
        $conn->close();
    } catch (Exception $e) {
        $response = ['status' => 'error', 'message' => 'Error: ' . $e->getMessage()];
        http_response_code(500); // Internal Server Error
        echo json_encode($response);
        exit();
    }
} else {
    $response = ['status' => 'error', 'message' => 'Session data not provided'];
    http_response_code(400); // Bad Request
    echo json_encode($response);
    exit();
}

echo json_encode($response);
exit();
?>
