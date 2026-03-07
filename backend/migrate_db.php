<?php
try {
    $host = '127.0.0.1';
    $db_name = 'knowledge_assessment';
    $username = 'root';
    $password = 'SAMskriti@0605';
    
    $conn = new PDO("mysql:host=$host;dbname=$db_name", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $sql = "ALTER TABLE assessments ADD COLUMN section VARCHAR(10) DEFAULT NULL AFTER class_name";
    $conn->exec($sql);
    echo "SUCCESS: Section column added to assessments table.";
} catch(PDOException $e) {
    if (strpos($e->getMessage(), 'Duplicate column name') !== false) {
        echo "INFO: Section column already exists.";
    } else {
        echo "ERROR: " . $e->getMessage();
    }
}
?>
