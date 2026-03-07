<?php
$host = "127.0.0.1";
$db_name = "knowledge_assessment";
$username = "root";
$password = "SAMskriti@0605";

try {
    $conn = new PDO("mysql:host=" . $host . ";dbname=" . $db_name, $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "Table: users\n";
    echo "------------------------------------------------\n";
    
    // Show columns
    $stmt = $conn->query("DESCRIBE users");
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    foreach ($columns as $col) {
        echo $col['Field'] . " (" . $col['Type'] . ")\n";
    }
    echo "------------------------------------------------\n";
    
    // Show sample data
    $stmt = $conn->query("SELECT * FROM users LIMIT 5");
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if (count($rows) > 0) {
        foreach ($rows as $row) {
            print_r($row);
            echo "------------------------------------------------\n";
        }
    } else {
        echo "No records found.\n";
    }

} catch(PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>
