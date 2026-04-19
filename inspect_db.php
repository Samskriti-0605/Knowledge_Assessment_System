<?php
require_once 'backend/config/db.php';
$database = new Database();
$db = $database->getConnection();

function checkTable($db, $tableName) {
    try {
        echo "Structures for table: $tableName\n";
        $stmt = $db->prepare("DESCRIBE $tableName");
        $stmt->execute();
        $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
        foreach ($columns as $column) {
            echo "- " . $column['Field'] . " (" . $column['Type'] . ")\n";
        }
        echo "\n";
    } catch (Exception $e) {
        echo "Error checking $tableName: " . $e->getMessage() . "\n\n";
    }
}

checkTable($db, 'users');
checkTable($db, 'assessments');
checkTable($db, 'questions');
checkTable($db, 'submissions');
?>
