<?php
$host = 'gateway01.ap-southeast-1.prod.alicloud.tidbcloud.com';
$port = '4000';
$user = '2SFYC7KqsohqJso.root';
$pass = 'jCBaFjHt4gRkTaW8';
$db_name = 'test';

echo "🚀 Connecting to TiDB ($host:$port)...\n";

try {
    $dsn = "mysql:host=$host;port=$port;dbname=$db_name";
    $pdo = new PDO($dsn, $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "✅ Connected successfully!\n";

    echo "📜 Reading database.sql...\n";
    $sql = file_get_contents('backend/database.sql');
    
    // Remove the CREATE DATABASE and USE lines as we are using the 'test' db
    $sql = preg_replace('/CREATE DATABASE IF NOT EXISTS.*;/i', '', $sql);
    $sql = preg_replace('/USE .*; /i', '', $sql);
    
    echo "🏗️ Initializing schema...\n";
    $pdo->exec($sql);
    echo "✅ Database initialized successfully with all tables!\n";

} catch (PDOException $e) {
    echo "❌ ERROR: " . $e->getMessage() . "\n";
    exit(1);
} catch (Exception $e) {
    echo "❌ UNEXPECTED ERROR: " . $e->getMessage() . "\n";
    exit(1);
}
?>
