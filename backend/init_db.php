<?php
require_once 'config/db.php';

try {
    $database = new Database();
    $db = $database->getConnection();

    // Create Tables from database.sql
    $sql = "
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL CHECK(role IN ('student', 'teacher')),
        class_name VARCHAR(50) DEFAULT NULL,
        section VARCHAR(10) DEFAULT NULL,
        roll_number VARCHAR(20) DEFAULT NULL,
        subject VARCHAR(100) DEFAULT NULL,
        phone_number VARCHAR(20) DEFAULT NULL,
        streak_count INTEGER DEFAULT 0,
        last_login DATE DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS assessments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        created_by INTEGER NOT NULL,
        duration_minutes INTEGER NOT NULL DEFAULT 30,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS questions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        assessment_id INTEGER NOT NULL,
        question_text TEXT NOT NULL,
        option_a VARCHAR(200) NOT NULL,
        option_b VARCHAR(200) NOT NULL,
        option_c VARCHAR(200) NOT NULL,
        option_d VARCHAR(200) NOT NULL,
        correct_option VARCHAR(1) NOT NULL CHECK(correct_option IN ('A', 'B', 'C', 'D')),
        marks INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS submissions (
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
    echo "<h1>Database Initialized Successfully!</h1>";
    echo "<p>All tables (users, assessments, questions, submissions) have been created.</p>";
    echo "<a href='https://knowledge-assessment-system.vercel.app/register'>Go to Registration</a>";

} catch (PDOException $e) {
    echo "<h1>Database Initialization Failed</h1>";
    echo "<p>Error: " . $e->getMessage() . "</p>";
}
?>
