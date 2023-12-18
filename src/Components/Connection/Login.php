<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

// Assuming you have a database connection established
// Replace 'your_database_connection' with your actual connection details
$conn = new mysqli('localhost:3306', 'root', '', 'stocktaken');

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get username and password from the request
$data = json_decode(file_get_contents('php://input'), true);
$username = $data['username'];
$password = $data['password'];

// Perform SQL query to check credentials
$sql = "SELECT * FROM users WHERE username='$username' AND password='$password'";
$result = $conn->query($sql);

// Check if a matching user was found
if ($result->num_rows > 0) {
    // Fetch user details
    $user = $result->fetch_assoc();

    // Start the session
    session_start();

    // Set session variables
    $_SESSION['isLoggedIn'] = true;
    $_SESSION['userId'] = $user['user_id'];
    $_SESSION['firstName'] = $user['first_name'];
    $_SESSION['lastName'] = $user['last_name'];
    $_SESSION['roll'] = $user['roll'];
    $_SESSION['status'] = $user['status'];

    
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false]);
}

// Close the database connection
$conn->close();
?>
