<?php
require_once __DIR__ . '/../config/db.php';

$database = new Database();
$db = $database->getConnection();

// 1. Find an admin or a teacher to be the "creator" (required by foreign key)
$query = "SELECT id FROM users WHERE role = 'teacher' LIMIT 1";
$stmt = $db->prepare($query);
$stmt->execute();
$teacher = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$teacher) {
    // Create a default system teacher if none exists
    $name = "System Administrator";
    $email = "admin@knowledge.app";
    $pass = password_hash("Admin@123", PASSWORD_BCRYPT);
    $q = "INSERT INTO users (name, email, password_hash, role, subject) VALUES (?, ?, ?, 'teacher', 'All Subjects')";
    $st = $db->prepare($q);
    $st->execute([$name, $email, $pass]);
    $creator_id = $db->lastInsertId();
    echo "Created System Teacher (admin@knowledge.app / Admin@123)\n";
} else {
    $creator_id = $teacher['id'];
}

// 2. Define Diagnostic Assessments
$diagnostics = [
    [
        'title' => 'Diagnostic - Mathematics',
        'category' => 'Mathematics',
        'questions' => [
            ['q' => 'What is 15% of 200?', 'a' => '20', 'b' => '30', 'c' => '40', 'd' => '15', 'correct' => 'B'],
            ['q' => 'A train covers 60km in 1 hour. How many meters per second is its speed?', 'a' => '10 m/s', 'b' => '16.67 m/s', 'c' => '20 m/s', 'd' => '25 m/s', 'correct' => 'B'],
            ['q' => 'Solve for x: 3x - 7 = 11', 'a' => '4', 'b' => '5', 'c' => '6', 'd' => '9', 'correct' => 'C'],
            ['q' => 'What is the square root of 225?', 'a' => '13', 'b' => '14', 'c' => '15', 'd' => '25', 'correct' => 'C']
        ]
    ],
    [
        'title' => 'Diagnostic - Science',
        'category' => 'Science',
        'questions' => [
            ['q' => 'Which planet is known as the Red Planet?', 'a' => 'Venus', 'b' => 'Mars', 'c' => 'Jupiter', 'd' => 'Saturn', 'correct' => 'B'],
            ['q' => 'What is the chemical symbol for Gold?', 'a' => 'Ag', 'b' => 'Au', 'c' => 'Pb', 'd' => 'Fe', 'correct' => 'B'],
            ['q' => 'What gas do plants primarily breathe in?', 'a' => 'Oxygen', 'b' => 'Nitrogen', 'c' => 'Carbon Dioxide', 'd' => 'Helium', 'correct' => 'C']
        ]
    ],
    [
        'title' => 'Diagnostic - English',
        'category' => 'English',
        'questions' => [
            ['q' => 'Identify the Synonym of "Abundant"', 'a' => 'Scarce', 'b' => 'Plentiful', 'c' => 'Rare', 'd' => 'Narrow', 'correct' => 'B'],
            ['q' => 'Choose the correctly spelled word', 'a' => 'Accomodate', 'b' => 'Accommodate', 'c' => 'Acomodate', 'd' => 'Accomadate', 'correct' => 'B']
        ]
    ],
    [
        'title' => 'Diagnostic - Logic',
        'category' => 'Logic',
        'questions' => [
            ['q' => 'If all bloops are razzies and all razzies are lazzies, then all bloops are lazzies.', 'a' => 'True', 'b' => 'False', 'c' => 'Cannot be determined', 'd' => 'None', 'correct' => 'A']
        ]
    ],
    [
        'title' => 'Diagnostic - General Knowledge',
        'category' => 'General Knowledge',
        'questions' => [
            ['q' => 'Who is known as the Father of the Indian Constitution?', 'a' => 'B.R. Ambedkar', 'b' => 'Mahatma Gandhi', 'c' => 'Jawaharlal Nehru', 'd' => 'Sardar Vallabhbhai Patel', 'correct' => 'A'],
            ['q' => 'Which is the longest river in the world?', 'a' => 'Amazon', 'b' => 'Nile', 'c' => 'Ganga', 'd' => 'Mississippi', 'correct' => 'B']
        ]
    ]
];

foreach ($diagnostics as $diag) {
    // Check if already exists
    $check = $db->prepare("SELECT id FROM assessments WHERE title = ?");
    $check->execute([$diag['title']]);
    if ($check->fetch()) {
        echo "Skipping {$diag['title']} (Already exists)\n";
        continue;
    }

    // Insert Assessment
    $q = "INSERT INTO assessments (title, description, created_by, duration_minutes, is_diagnostic, category) VALUES (?, ?, ?, ?, 1, ?)";
    $stmt = $db->prepare($q);
    $stmt->execute([$diag['title'], 'Initial baseline assessment for ' . $diag['category'], $creator_id, 10, $diag['category']]);
    $assessment_id = $db->lastInsertId();

    // Insert Questions
    foreach($diag['questions'] as $quest) {
        $q2 = "INSERT INTO questions (assessment_id, question_text, option_a, option_b, option_c, option_d, correct_option, marks) VALUES (?, ?, ?, ?, ?, ?, ?, 5)";
        $stmt2 = $db->prepare($q2);
        $stmt2->execute([$assessment_id, $quest['q'], $quest['a'], $quest['b'], $quest['c'], $quest['d'], $quest['correct']]);
    }
    echo "Created Assessment: {$diag['title']}\n";
}
?>
