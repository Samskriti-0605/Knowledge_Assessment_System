<?php
require_once '../config/db.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    echo "Starting Online Migration...\n";
    
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
    
    // Add class/section to assessments if they missing (for the teacher dashboard)
    try {
        // First check if columns exist before adding
        $db->exec("ALTER TABLE assessments ADD COLUMN IF NOT EXISTS class_name VARCHAR(50) DEFAULT NULL AFTER duration_minutes");
        $db->exec("ALTER TABLE assessments ADD COLUMN IF NOT EXISTS section VARCHAR(10) DEFAULT NULL AFTER class_name");
        echo "SUCCESS: Added/Verified assessment columns.\n";
    } catch (PDOException $e) {
        // Fallback for MySQL versions that don't support ADD COLUMN IF NOT EXISTS
        try {
            $db->exec("ALTER TABLE assessments ADD COLUMN class_name VARCHAR(50) DEFAULT NULL AFTER duration_minutes");
            $db->exec("ALTER TABLE assessments ADD COLUMN section VARCHAR(10) DEFAULT NULL AFTER class_name");
            echo "SUCCESS: Added assessment columns (Legacy mode).\n";
        } catch (PDOException $e2) {
            echo "INFO: Assessment columns already exist or error: " . $e2->getMessage() . "\n";
        }
    }

    echo "Migration Complete!\n";
    
} catch (Exception $e) {
    echo "FATAL ERROR during migration: " . $e->getMessage() . "\n";
}
?>
