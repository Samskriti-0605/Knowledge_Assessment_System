<?php
$db_file = __DIR__ . '/config/database.sqlite';
if (file_exists($db_file)) {
    unlink($db_file);
}

try {
    $db = new PDO("sqlite:" . $db_file);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $sql = "
    CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL,
        class_name VARCHAR(50) DEFAULT NULL,
        section VARCHAR(10) DEFAULT NULL,
        roll_number VARCHAR(20) DEFAULT NULL,
        subject VARCHAR(100) DEFAULT NULL,
        phone_number VARCHAR(20) DEFAULT NULL,
        streak_count INTEGER DEFAULT 0,
        last_login DATE DEFAULT NULL,
        delete_requested INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE assessments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        created_by INTEGER NOT NULL,
        duration_minutes INTEGER NOT NULL DEFAULT 30,
        class_name VARCHAR(50) DEFAULT NULL,
        section VARCHAR(10) DEFAULT NULL,
        category VARCHAR(100) DEFAULT 'General Knowledge',
        is_diagnostic INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE questions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        assessment_id INTEGER NOT NULL,
        question_text TEXT NOT NULL,
        option_a VARCHAR(200) NOT NULL,
        option_b VARCHAR(200) NOT NULL,
        option_c VARCHAR(200) NOT NULL,
        option_d VARCHAR(200) NOT NULL,
        correct_option VARCHAR(1) NOT NULL,
        marks INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE
    );

    CREATE TABLE submissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        assessment_id INTEGER NOT NULL,
        score INTEGER NOT NULL,
        total_marks INTEGER NOT NULL,
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE
    );
    ";

    $db->exec($sql);
    echo "Database initialized successfully at $db_file\n";

} catch (PDOException $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    exit(1);
}
?>
