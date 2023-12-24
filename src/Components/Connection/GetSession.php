<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

// Start the session
session_start();

// Check if the user is logged in
if (isset($_SESSION['isLoggedIn']) && $_SESSION['isLoggedIn'] === true) {
            // User is logged in, return user information
            $conn = new mysqli('localhost', 'root', '', 'stocktaken');

            // Check connection
            if ($conn->connect_error) {
                die("Connection failed: " . $conn->connect_error);
            }

            $sql = "SELECT * FROM sessions WHERE account_id = '". $_SESSION['accountId'] ."' AND status='Active' ";
            $result = $conn->query($sql);
            // Check if a matching user was found
            if ($result->num_rows > 0) {
                $row = $result->fetch_assoc();
                $current_date = date("Y-m-d H:i:s");
                $create_time = strtotime($row['create_time']);
                $current_time = strtotime($current_date);
                $time_difference = $current_time - $create_time;
                $formatted_time_difference = gmdate("H:i:s", $time_difference);

                
                $_SESSION['SessionName'] = $row['session_name'];
            $sessionInfo = [
                'SessionName' => $row['session_name'],
                'SessionStatus' => $row['status'],
                'SessionTime' => $formatted_time_difference,
            ];
            echo json_encode(['success' => true, 'session' => $sessionInfo]);
        }else{
            echo json_encode(['success' => false]);
        }
           
} else {
    // User is not logged in
    echo json_encode(['success' => false, 'message' => 'User not logged in']);
}
?>
