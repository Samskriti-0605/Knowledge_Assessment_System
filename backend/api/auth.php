<?php
include_once '../config/db.php';
handleCors();

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_GET['action']) && $_GET['action'] == 'register') {
        // Registration
        if (!empty($data->name) && !empty($data->email) && !empty($data->password) && !empty($data->role)) {
            // Base query
            $query = "INSERT INTO users SET name=:name, email=:email, password_hash=:password, role=:role";
            
            // Add student/teacher specific fields
            if ($data->role === 'student' || $data->role === 'teacher') {
                $query .= ", class_name=:class_name, section=:section, roll_number=:roll_number, subject=:subject, phone_number=:phone_number";
            }
            
            $stmt = $db->prepare($query);
            
            $password_hash = password_hash($data->password, PASSWORD_BCRYPT);
            
            $stmt->bindParam(":name", $data->name);
            $stmt->bindParam(":email", $data->email);
            $stmt->bindParam(":password", $password_hash);
            $stmt->bindParam(":role", $data->role);
            
            // Bind optional fields
            if ($data->role === 'student' || $data->role === 'teacher') {
                $class_name = $data->class_name ?? null;
                $section = $data->section ?? null;
                $roll_number = $data->roll_number ?? null;
                $subject = $data->subject ?? null;
                $phone_number = $data->phone_number ?? null;
                
                $stmt->bindParam(":class_name", $class_name);
                $stmt->bindParam(":section", $section);
                $stmt->bindParam(":roll_number", $roll_number);
                $stmt->bindParam(":subject", $subject);
                $stmt->bindParam(":phone_number", $phone_number);
            }
            
            try {
                if ($stmt->execute()) {
                    http_response_code(201);
                    echo json_encode(array("message" => "User was registered."));
                } else {
                    http_response_code(503);
                    echo json_encode(array("message" => "Unable to register user.", "error" => $stmt->errorInfo()));
                }
            } catch (PDOException $e) {
                http_response_code(500);
                echo json_encode(array("message" => "Registration error: " . $e->getMessage()));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Incomplete data."));
        }
    } elseif (isset($_GET['action']) && $_GET['action'] == 'login') {
        // Login
        if (!empty($data->email) && !empty($data->password)) {
            $query = "SELECT * FROM users WHERE email = :email LIMIT 0,1";
            $stmt = $db->prepare($query);
            $stmt->bindParam(":email", $data->email);
            $stmt->execute();
            
            if ($stmt->rowCount() > 0) {
                $row = $stmt->fetch(PDO::FETCH_ASSOC);
                if (password_verify($data->password, $row['password_hash'])) {
                    
                    // Daily Streak Logic
                    $today = date('Y-m-d');
                    $last_login = $row['last_login'];
                    $streak = $row['streak_count'];
                    
                    if ($last_login != $today) {
                        // Check if last login was yesterday
                        $yesterday = aadate('Y-m-d', strtotime('-1 day'));
                        
                        if ($last_login == $yesterday) {
                            $streak++;
                        } else {
                            $streak = 1; // Reset streak if missed a day (or first time)
                        }
                        
                        // Update DB
                        $update_query = "UPDATE users SET last_login = :today, streak_count = :streak WHERE id = :id";
                        $update_stmt = $db->prepare($update_query);
                        $update_stmt->bindParam(':today', $today);
                        $update_stmt->bindParam(':streak', $streak);
                        $update_stmt->bindParam(':id', $row['id']);
                        $update_stmt->execute();
                        
                        // Update local row for response
                        $row['streak_count'] = $streak;
                        $row['last_login'] = $today;
                    }

                    http_response_code(200);
                    // In a real app, generate a JWT token here. For simplicity, returning user info.
                    unset($row['password_hash']);
                    echo json_encode(array(
                        "message" => "Login successful.",
                        "user" => $row
                    ));
                } else {
                    http_response_code(401);
                    echo json_encode(array("message" => "Invalid password."));
                }
            } else {
                http_response_code(401);
                echo json_encode(array("message" => "Invalid email."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Incomplete data."));
        }
    }
}
?>
