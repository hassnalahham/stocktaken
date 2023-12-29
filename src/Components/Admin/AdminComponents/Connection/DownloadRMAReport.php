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

$sessionRMA = $_SESSION['SessionNameRMA'];

// Fetch data from PHPMyAdmin table
$sql = "
SELECT 
    COALESCE(o.barcode, n.barcode) AS barcode,
    COALESCE(n.rma, 0) AS rma,
    CASE 
        WHEN o.barcode IS NOT NULL AND n.barcode IS NOT NULL AND o.rma = n.rma THEN 'Matched'
        ELSE 'Unmatched'
    END AS match_status
FROM $sessionRMA o
LEFT JOIN barcodes n ON o.barcode = n.barcode

UNION

SELECT 
    COALESCE(o.barcode, n.barcode) AS barcode,
    COALESCE(n.rma, 0) AS rma,
    CASE 
        WHEN o.barcode IS NOT NULL AND n.barcode IS NOT NULL AND o.rma = n.rma THEN 'Matched'
        ELSE 'Unmatched'
    END AS match_status
FROM $sessionRMA o
RIGHT JOIN barcodes n ON o.barcode = n.barcode
WHERE o.barcode IS NULL;

";
$result = mysqli_query($conn, $sql);

// Set headers to force download
header('Content-Type: text/csv');
header('Content-Disposition: attachment;filename=RMA_Report.csv');
header('Cache-Control: max-age=0');

// Open output stream
$output = fopen('php://output', 'w');

// Output column headers
$columnHeaders = array("Barcode", "RMA"); // Replace with your actual column names
fputcsv($output, $columnHeaders);

// Output data
while ($row = mysqli_fetch_assoc($result)) {
    fputcsv($output, $row);
}

// Close output stream
fclose($output);

// Close database connection
mysqli_close($conn);

exit;
?>
