<?php
function httpPost($url, $data) {
    $options = [
        'http' => [
            'header' => "Content-Type: application/json\r\n",
            'method' => 'POST',
            'content' => json_encode($data),
            'ignore_errors' => true,
        ]
    ];
    $context = stream_context_create($options);
    $result = file_get_contents($url, false, $context);
    // Get status code from headers
    $code = 0;
    if (isset($http_response_header[0])) {
        preg_match('/\d{3}/', $http_response_header[0], $matches);
        $code = $matches[0] ?? 0;
    }
    return ['code' => $code, 'body' => $result];
}

echo "=== Test 1: Register Student ===\n";
$res = httpPost('http://127.0.0.1:8000/api/auth.php?action=register', [
    'name' => 'Test Student',
    'email' => 'student@test.com',
    'password' => 'Test1234',
    'role' => 'student',
    'class_name' => '10',
    'section' => 'A',
    'roll_number' => '101'
]);
echo "Status: {$res['code']}\nResponse: {$res['body']}\n\n";

echo "=== Test 2: Login Student ===\n";
$res = httpPost('http://127.0.0.1:8000/api/auth.php?action=login', [
    'email' => 'student@test.com',
    'password' => 'Test1234'
]);
echo "Status: {$res['code']}\nResponse: {$res['body']}\n\n";

echo "=== Test 3: Register Teacher ===\n";
$res = httpPost('http://127.0.0.1:8000/api/auth.php?action=register', [
    'name' => 'Test Teacher',
    'email' => 'teacher@test.com',
    'password' => 'Test1234',
    'role' => 'teacher',
    'class_name' => '10',
    'section' => 'A',
    'subject' => 'Mathematics'
]);
echo "Status: {$res['code']}\nResponse: {$res['body']}\n";
?>
