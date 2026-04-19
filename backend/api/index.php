<?php
require_once '../config/db.php';
header('Content-Type: application/json');
echo json_encode([
    "status" => "success",
    "message" => "Knowledge Assessment System API is online.",
    "version" => "1.0.0",
    "timestamp" => date('Y-m-d H:i:s')
]);
?>
