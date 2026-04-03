<?php
require_once 'config/db.php';

try {
    $database = new Database();
    $db = $database->getConnection();

    function renderTable($db, $tableName, $headers) {
        $query = "SELECT * FROM $tableName ORDER BY id DESC LIMIT 10";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo "<h3>Table: $tableName (Last 10 entries)</h3>";
        if (count($rows) > 0) {
            echo "<table><tr>";
            foreach ($headers as $header) echo "<th>$header</th>";
            echo "</tr>";
            foreach ($rows as $row) {
                echo "<tr>";
                foreach ($headers as $key) echo "<td>" . (isset($row[$key]) ? $row[$key] : 'NULL') . "</td>";
                echo "</tr>";
            }
            echo "</table>";
        } else {
            echo "<p class='empty'>No data found in $tableName.</p>";
        }
    }

    echo "<html><head><title>Full Database Inspector</title>";
    echo "<style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 30px; background: #eef2f3; color: #333; }
        .container { max-width: 1200px; margin: auto; background: white; padding: 25px; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
        table { width: 100%; border-collapse: collapse; margin-bottom: 30px; background: white; font-size: 0.9rem; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #eee; }
        th { background-color: #3498db; color: white; text-transform: uppercase; letter-spacing: 1px; }
        tr:hover { background-color: #f9f9f9; }
        h2 { color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px; }
        h3 { color: #2980b9; margin-top: 40px; }
        .empty { font-style: italic; color: #95a5a6; padding: 10px; background: #fdfdfd; border-left: 4px solid #bdc3c7; }
        .nav-links { margin-bottom: 20px; }
        .nav-links a { margin-right: 15px; color: #3498db; text-decoration: none; font-weight: bold; }
        .nav-links a:hover { text-decoration: underline; }
    </style></head><body>";
    
    echo "<div class='container'>";
    echo "<h2>Live Database Storage Inspector</h2>";
    echo "<div class='nav-links'>
            <a href='https://knowledge-assessment-system.vercel.app/register'>Register New</a> | 
            <a href='https://knowledge-assessment-system.vercel.app/login'>Login</a> | 
            <a href='index.php'>API Status</a>
          </div>";

    // 1. Users Table
    renderTable($db, 'users', ['id', 'name', 'email', 'role', 'class_name', 'created_at']);

    // 2. Assessments Table
    renderTable($db, 'assessments', ['id', 'title', 'created_by', 'duration_minutes', 'created_at']);

    // 3. Submissions Table
    renderTable($db, 'submissions', ['id', 'user_id', 'assessment_id', 'score', 'total_marks', 'submitted_at']);

    echo "</div></body></html>";

} catch (PDOException $e) {
    echo "<div class='container'><h1>Database Error</h1><p>" . $e->getMessage() . "</p></div>";
}
?>
