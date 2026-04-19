<?php
$data = json_encode([
    'name' => 'Test User',
    'email' => 'test_user_ps@example.com',
    'password' => 'password123',
    'role' => 'student'
]);
$url = 'https://knowledge-assessment-backend.onrender.com/api/auth.php?action=register';
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type:application/json']);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$result = curl_exec($ch);
echo "Result:\n" . $result . "\n";
echo "HTTP Code:\n" . curl_getinfo($ch, CURLINFO_HTTP_CODE) . "\n";
curl_close($ch);
