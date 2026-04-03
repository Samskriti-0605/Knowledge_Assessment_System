<?php
require_once 'config/db.php';

// Final Solid Auth Logic with Exception Handling
if ($_SERVER['REQUEST_METHOD'] == 'POST' || $_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    try {
        $database = new Database();
        $db = $database->getConnection();
        $data = json_decode(file_get_contents("php://input"), true) ?: $_POST;
        $action = $_GET['action'] ?? '';

        if ($action == 'register') {
            if (!empty($data['name']) && !empty($data['email']) && !empty($data['password'])) {
                $query = "INSERT INTO users (name, email, password_hash, role, class_name, section, streak_count, last_login) 
                          VALUES (:name, :email, :password, :role, :class, :section, 0, NULL)";
                $stmt = $db->prepare($query);
                
                $role = $data['role'] ?? 'student';
                $class = $data['class_name'] ?? null;
                $section = $data['section'] ?? null;
                $password_hash = password_hash($data['password'], PASSWORD_BCRYPT);

                $stmt->bindParam(':name', $data['name']);
                $stmt->bindParam(':email', $data['email']);
                $stmt->bindParam(':password', $password_hash);
                $stmt->bindParam(':role', $role);
                $stmt->bindParam(':class', $class);
                $stmt->bindParam(':section', $section);

                if ($stmt->execute()) {
                    http_response_code(201);
                    echo json_encode(array("message" => "User registered successfully."));
                }
            } else {
                http_response_code(400);
                echo json_encode(array("message" => "Incomplete registration data."));
            }
        } elseif ($action == 'login') {
            if (!empty($data['email']) && !empty($data['password'])) {
                $query = "SELECT * FROM users WHERE email = :email LIMIT 0,1";
                $stmt = $db->prepare($query);
                $stmt->bindParam(':email', $data['email']);
                $stmt->execute();

                if ($stmt->rowCount() > 0) {
                    $row = $stmt->fetch(PDO::FETCH_ASSOC);
                    if (password_verify($data['password'], $row['password_hash'])) {
                        
                        // Handle Streak
                        $today = date('Y-m-d');
                        $last_login = $row['last_login'];
                        $streak = $row['streak_count'] ?: 0;

                        if ($last_login != $today) {
                            $yesterday = date('Y-m-d', strtotime('-1 day'));
                            if ($last_login == $yesterday) {
                                $streak++;
                            } else {
                                $streak = 1;
                            }
                            $update = $db->prepare("UPDATE users SET last_login = :today, streak_count = :streak WHERE id = :id");
                            $update->execute([':today' => $today, ':streak' => $streak, ':id' => $row['id']]);
                            $row['streak_count'] = $streak;
                            $row['last_login'] = $today;
                        }

                        unset($row['password_hash']);
                        http_response_code(200);
                        echo json_encode(array("message" => "Login successful", "user" => $row));
                    } else {
                        http_response_code(401);
                        echo json_encode(array("message" => "Invalid password."));
                    }
                } else {
                    http_response_code(401);
                    echo json_encode(array("message" => "User not found. Please register first."));
                }
            } else {
                http_response_code(400);
                echo json_encode(array("message" => "Email and password required."));
            }
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(array("message" => "Server Error: " . $e->getMessage()));
    }
}
?>
