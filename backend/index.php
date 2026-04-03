<?php
// Root index.php to prevent "Forbidden" errors when visiting the root domain.
header('Content-Type: application/json; charset=utf-8');

echo json_encode([
    "status" => "online",
    "message" => "Knowledge Assessment System Backend (PHP) is running.",
    "version" => "1.0.0",
    "environment" => "production"
]);
?>
