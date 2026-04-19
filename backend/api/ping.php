<?php
require_once '../config/db.php';

// Public health check endpoint
header('Content-Type: application/json');

try {
    $database = new Database();
    $db = $database->getConnection();
    
    echo json_encode(array(
        "status" => "success",
        "message" => "Backend is online and database is accessible.",
        "timestamp" => date('Y-m-d H:i:s'),
        "server" => $_SERVER['SERVER_NAME'] ?? 'Render'
    ));
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array(
        "status" => "error",
        "message" => "Backend is online but database failed: " . $e->getMessage()
    ));
}
?>
