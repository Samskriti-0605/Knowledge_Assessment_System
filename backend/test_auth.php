<?php
$data = json_encode(['name'=>'TestUser2', 'email'=>'test2@example.com', 'password'=>'password123', 'role'=>'student']);
$options = [
    'http' => [
        'method' => 'POST',
        'header' => 'Content-Type: application/json',
        'content' => $data
    ]
];
$context = stream_context_create($options);
$result = file_get_contents('http://localhost:8000/api/auth.php?action=register', false, $context);
echo "Register result: " . $result . "\n";

$loginData = json_encode(['email'=>'test2@example.com', 'password'=>'password123']);
$loginOptions = [
    'http' => [
        'method' => 'POST',
        'header' => 'Content-Type: application/json',
        'content' => $loginData
    ]
];
$loginContext = stream_context_create($loginOptions);
$loginResult = file_get_contents('http://localhost:8000/api/auth.php?action=login', false, $loginContext);
echo "Login result: " . $loginResult . "\n";
