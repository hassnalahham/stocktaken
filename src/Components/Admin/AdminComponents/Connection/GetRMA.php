<?php
header("Access-Control-Allow-Origin: https://scannerst.pro/");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

error_log("Debug: Something happened here", 0);

// Start the session
session_start();

// Check if the user is logged in
if (isset($_SESSION['isLoggedIn']) && $_SESSION['isLoggedIn'] === true) {
    // User is logged in, return user information
    
    // Use a try-catch block for database connection to handle any potential exceptions
    try {
        $conn = new mysqli('localhost:3306', 'scanners_root', 'Zcjqf6679xk2', 'scanners_stocktaken');

        // Check the connection
        if ($conn->connect_error) {
            throw new Exception('Connection failed: ' . $conn->connect_error);
        }

        if (isset($_SESSION['SessionNameRMA'])) {
            $tableName = $_SESSION['SessionNameRMA'];

            // Use a regular query with proper escaping for the table name
            $tableName = $conn->real_escape_string($tableName);
            $sql = "SELECT * FROM $tableName";
            
            $result = $conn->query($sql);

            if ($result !== false) {
                if ($result->num_rows > 0) {
                    echo json_encode(['success' => false]);
                } else {
                    echo json_encode(['success' => true]);
                }
            } else {
                // Handle query execution error
                echo json_encode(['success' => false, 'message' => 'Error executing query: ' . $conn->error]);
            }
            
        } else {
            echo json_encode(['success' => false]);
        }

        // Close the connection
        $conn->close();
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
    }
} else {
    // User is not logged in
    echo json_encode(['success' => false, 'message' => 'User not logged in']);
}
?>
