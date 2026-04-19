<?php
require_once 'backend/config/db.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    echo "Starting Migration...\n";
    
    // Add streak_count column if it doesn't exist
    try {
        $db->exec("ALTER TABLE users ADD COLUMN streak_count INT DEFAULT 0 AFTER phone_number");
        echo "SUCCESS: Added streak_count column.\n";
    } catch (PDOException $e) {
        echo "INFO: streak_count column already exists.\n";
    }
    
    // Add last_login column if it doesn't exist
    try {
        $db->exec("ALTER TABLE users ADD COLUMN last_login DATE DEFAULT NULL AFTER streak_count");
        echo "SUCCESS: Added last_login column.\n";
    } catch (PDOException $e) {
        echo "INFO: last_login column already exists.\n";
    }
    
    echo "Migration Complete!\n";
    
} catch (Exception $e) {
    echo "FATAL ERROR during migration: " . $e->getMessage() . "\n";
}
?>
