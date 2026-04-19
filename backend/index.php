<?php
require_once 'config/db.php';
header('Content-Type: application/json');
echo json_encode([
    "status" => "success",
    "message" => "Knowledge Assessment System API - System V2.0",
    "environment" => "Production",
    "timestamp" => date('Y-m-d H:i:s'),
    "cors" => "enabled"
]);
?>
