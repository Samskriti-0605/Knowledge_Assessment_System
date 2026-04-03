<?php
require_once 'config/db.php';

try {
    $database = new Database();
    $db = $database->getConnection();

    // Create Tables from database.sql
    $sql = "
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('student', 'teacher') NOT NULL,
        class_name VARCHAR(50) DEFAULT NULL,
        section VARCHAR(10) DEFAULT NULL,
        roll_number VARCHAR(20) DEFAULT NULL,
        subject VARCHAR(100) DEFAULT NULL,
        phone_number VARCHAR(20) DEFAULT NULL,
        streak_count INT DEFAULT 0,
        last_login DATE DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS assessments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        created_by INT NOT NULL,
        duration_minutes INT NOT NULL DEFAULT 30,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS questions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        assessment_id INT NOT NULL,
        question_text TEXT NOT NULL,
        option_a VARCHAR(200) NOT NULL,
        option_b VARCHAR(200) NOT NULL,
        option_c VARCHAR(200) NOT NULL,
        option_d VARCHAR(200) NOT NULL,
        correct_option ENUM('A', 'B', 'C', 'D') NOT NULL,
        marks INT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS submissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        assessment_id INT NOT NULL,
        score INT NOT NULL,
        total_marks INT NOT NULL,
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
