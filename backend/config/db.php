<?php
// Function to handle CORS - MUST BE CALLED IMMEDIATELY
function handleCors() {
    if (headers_sent()) return;

    $origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
    header("Access-Control-Allow-Credentials: true");

    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        http_response_code(204); // Standard "No Content" for successful preflight
        exit();
    }
}

// Call CORS handler immediately upon inclusion
handleCors();

class Database {
    public $conn;

    public function getConnection() {
        $this->conn = null;

        try {
            // Use SQLite and store the database file in the config folder
            $db_path = __DIR__ . '/database.sqlite';
            $this->conn = new PDO("sqlite:" . $db_path);
            
            // Enable foreign keys for SQLite
            $this->conn->exec("PRAGMA foreign_keys = ON;");
            
            // Throw exceptions on errors
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $exception) {
            http_response_code(500);
            echo json_encode(array("message" => "Connection error: " . $exception->getMessage()));
            exit;
        }

        return $this->conn;
    }
}
?>
