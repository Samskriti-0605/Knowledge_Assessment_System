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
    private $host;
    private $db_name;
    private $username;
    private $password;
    public $conn;

    public function __construct() {
        $this->host     = getenv('DB_HOST') ?: '127.0.0.1';
        $this->db_name  = getenv('DB_NAME') ?: 'knowledge_assessment';
        $this->username = getenv('DB_USER') ?: 'root';
        $this->password = getenv('DB_PASS') ?: 'SAMskriti@0605';
    }

    public function getConnection() {
        $this->conn = null;

        try {
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
            $this->conn->exec("set names utf8");
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
