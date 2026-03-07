<?php
require_once 'config/db.php';
$database = new Database();
try {
    $db = $database->getConnection();
    if ($db) {
        echo "SUCCESS: Database connection established.\n";
    } else {
        echo "FAILURE: Database connection failed (null returned).\n";
    }
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
?>
