<?php
// Function to handle CORS - MUST BE CALLED IMMEDIATELY
function handleCors() {
    if (headers_sent()) return;

    $origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
    header("Access-Control-Allow-Credentials: true");

    if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        http_response_code(204);
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
            $db_url = getenv('DATABASE_URL'); // Render PostgreSQL provides this
            $db_host = getenv('DB_HOST');    // TiDB or other MySQL

            if ($db_url) {
                // --- PRODUCTION: PostgreSQL on Render ---
                // Parse URI: postgres://user:pass@host:port/dbname
                $parsed = parse_url($db_url);
                $host = $parsed['host'];
                $port = $parsed['port'] ?? '5432';
                $user = $parsed['user'];
                $pass = $parsed['pass'];
                $path = ltrim($parsed['path'], '/');
                
                $dsn = "pgsql:host=$host;port=$port;dbname=$path;user=$user;password=$pass";
                $this->conn = new PDO($dsn);
            } elseif ($db_host) {
                // --- PRODUCTION: MySQL ---
                $db_name = getenv('DB_NAME') ?: 'knowledge_assessment';
                $db_user = getenv('DB_USER') ?: 'root';
                $db_pass = getenv('DB_PASS') ?: '';
                $db_port = getenv('DB_PORT') ?: '3306';

                $dsn = "mysql:host=$db_host;port=$db_port;dbname=$db_name;charset=utf8mb4";
                $this->conn = new PDO($dsn, $db_user, $db_pass);
            } else {
                // --- LOCAL: SQLite ---
                $db_path = __DIR__ . '/database.sqlite';
                $this->conn = new PDO("sqlite:" . $db_path);
                $this->conn->exec("PRAGMA foreign_keys = ON;");
            }

            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            
            // --- AUTO-INITIALIZATION (Zero-Touch) ---
            // If PostgreSQL, check if 'users' table exists. If not, initialize.
            if ($db_url) {
                $check = $this->conn->query("SELECT to_regclass('public.users')");
                if ($check->fetchColumn() === null) {
                    $sql_file = __DIR__ . '/../database_psql.sql';
                    if (file_exists($sql_file)) {
                        $this->conn->exec(file_get_contents($sql_file));
                    }
                }
            } elseif (!$db_host) { 
                // For SQLite: check if 'users' table exists 
                $check = $this->conn->query("SELECT name FROM sqlite_master WHERE type='table' AND name='users'");
                if (!$check->fetch()) {
                    // Local SQLite initialization would happen here if needed
                }
            }
        } catch(PDOException $exception) {
            http_response_code(500);
            echo json_encode(array("message" => "Connection error: " . $exception->getMessage()));
            exit;
        }

        return $this->conn;
    }
}
?>
