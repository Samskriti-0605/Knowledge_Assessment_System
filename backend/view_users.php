<?php
require_once 'config/db.php';

try {
    $database = new Database();
    $db = $database->getConnection();

    $query = "SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo "<html><head><title>Database Viewer</title>";
    echo "<style>
        body { font-family: sans-serif; padding: 20px; background: #f4f7f6; }
        table { width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #4CAF50; color: white; }
        tr:hover { background-color: #f5f5f5; }
        h2 { color: #333; }
    </style></head><body>";
    
    echo "<h2>Registered Users (Live Database)</h2>";
    
    if (count($users) > 0) {
        echo "<table><tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Registered At</th></tr>";
        foreach ($users as $user) {
            echo "<tr>";
            echo "<td>" . $user['id'] . "</td>";
            echo "<td>" . $user['name'] . "</td>";
            echo "<td>" . $user['email'] . "</td>";
            echo "<td>" . $user['role'] . "</td>";
            echo "<td>" . $user['created_at'] . "</td>";
            echo "</tr>";
        }
        echo "</table>";
    } else {
        echo "<p>No users found in the database. Please register an account first!</p>";
    }
    
    echo "<br><a href='https://knowledge-assessment-system.vercel.app/register'>Go to Register</a>";
    echo " | <a href='https://knowledge-assessment-system.vercel.app/login'>Go to Login</a>";
    echo "</body></html>";

} catch (PDOException $e) {
    echo "<h1>Database Error</h1>";
    echo "<p>" . $e->getMessage() . "</p>";
}
?>
