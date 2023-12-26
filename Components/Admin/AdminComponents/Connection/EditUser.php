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
if (isset($data['selectedUser'])) {
    $user = $data['selectedUser'];
    $userId = $user['userId'];
    $firstname = $user['userFirstname'];
    $lastname = $user['userLastname'];
    $status = $user['userStatus'];
    $roll = $user['userRoll'];
    $userpassword = $user['userPassword'];


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

    if($userId != $_SESSION['userId']){
        $updatesql = "UPDATE users SET first_name=? , last_name=? , status=? , roll=? , password=? WHERE user_id = ?";
        $stmt = $conn->prepare($updatesql);
        $stmt->bind_param('sssssi', $firstname, $lastname, $status, $roll, $userpassword, $userId);

        if ($stmt->execute()) {
            $response = ['status' => 'success', 'message' => 'User Updated'. $userId . $firstname . $lastname . $status . $roll ];
        } else {
            $response = ['status' => 'error', 'message' => 'Error Editing User: ' . $stmt->error];
        }
        $stmt->close();
        $conn->close();
    }else{
        $response = ['status' => 'error', 'message' => 'Admin You Cannot Edit Your Profile'];
    }

       
    
    
} else {
    $response = ['status' => 'error', 'message' => 'User data not provided'];
}

echo json_encode($response);
?>
