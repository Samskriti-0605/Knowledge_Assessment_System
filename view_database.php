<?php
$host = "127.0.0.1";
$db_name = "knowledge_assessment";
$username = "root";
$password = "SAMskriti@0605";

try {
    $conn = new PDO("mysql:host=" . $host . ";dbname=" . $db_name, $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "Connected to database: $db_name\n";
    echo "------------------------------------------------\n";
    echo sprintf("%-30s | %s\n", "Table Name", "Row Count");
    echo "------------------------------------------------\n";
    
    $stmt = $conn->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    foreach ($tables as $table) {
        $countStmt = $conn->query("SELECT COUNT(*) FROM `$table`");
        $count = $countStmt->fetchColumn();
        echo sprintf("%-30s | %d\n", $table, $count);
    }
    echo "------------------------------------------------\n";
    
} catch(PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>
