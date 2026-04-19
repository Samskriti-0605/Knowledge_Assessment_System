<?php
$id_one = 'sql12822127';
$id_two = 'sql112822127';
$pass = 'Ucp31pwnNP';
$host = 'sql12.freesqldatabase.com';

echo "Testing ID One: $id_one\n";
try {
    $c = new PDO("mysql:host=$host;dbname=$id_one", $id_one, $pass);
    echo "✅ SUCCESS with ONE 1 ($id_one)\n";
} catch(Exception $e) {
    echo "❌ FAIL: " . $e->getMessage() . "\n";
}

echo "\nTesting ID Two: $id_two\n";
try {
    $c = new PDO("mysql:host=$host;dbname=$id_two", $id_two, $pass);
    echo "✅ SUCCESS with TWO 1s ($id_two)\n";
} catch(Exception $e) {
    echo "❌ FAIL: " . $e->getMessage() . "\n";
}
?>
