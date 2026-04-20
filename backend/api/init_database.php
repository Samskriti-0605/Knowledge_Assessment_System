<?php
include_once '../config/db.php';
handleCors();

/**
 * DATABASE INITIALIZATION SCRIPT (PostgreSQL)
 * Visit this URL once on Render to create your tables.
 */

try {
    $database = new Database();
    $db = $database->getConnection();

    echo "🚀 Connecting to PostgreSQL database...<br>";

    // Read the PSQL schema file
    $sql_file = '../database_psql.sql';
    if (!file_exists($sql_file)) {
        throw new Exception("PSQL schema file not found at $sql_file");
    }

    $sql = file_get_contents($sql_file);

    echo "🏗️ Initializing tables...<br>";
    $db->exec($sql);

    echo "✅ <b>Success!</b> Database tables created successfully.<br>";
    echo "You can now go back to your <a href='/'>Frontend</a> and register your first account!";

} catch (Exception $e) {
    http_response_code(500);
    echo "❌ <b>ERROR:</b> " . $e->getMessage();
}
?>
