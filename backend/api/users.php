<?php
include_once '../config/db.php';
handleCors();

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents("php://input"));

if ($method == 'GET') {
    if (isset($_GET['id'])) {
        $query = "SELECT id, name, email, role, class_name, section, roll_number, subject, phone_number FROM users WHERE id = :id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':id', $_GET['id']);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode($user);
    } elseif (isset($_GET['class_name'])) {
        $query = "SELECT id, name, role, class_name, section, roll_number, subject FROM users WHERE class_name = :class_name";
        $params = [':class_name' => $_GET['class_name']];

        if (isset($_GET['section'])) {
            $query .= " AND section = :section";
            $params[':section'] = $_GET['section'];
        }

        if (isset($_GET['role'])) {
            $query .= " AND role = :role";
            $params[':role'] = $_GET['role'];
        }

        $query .= " ORDER BY name ASC";
        $stmt = $db->prepare($query);
        foreach ($params as $key => $val) {
            $stmt->bindValue($key, $val);
        }
        $stmt->execute();
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($users);
    }
} elseif ($method == 'PUT') {
    if (!empty($data->id) && !empty($data->name) && !empty($data->email)) {
        
        $query = "UPDATE users SET name = :name, email = :email";
        
        if (!empty($data->password)) {
            $query .= ", password_hash = :password";
        }
        
        // Add student-specific fields
        if (isset($data->class_name)) {
            $query .= ", class_name = :class_name";
        }
        if (isset($data->section)) {
            $query .= ", section = :section";
        }
        if (isset($data->roll_number)) {
            $query .= ", roll_number = :roll_number";
        }
        if (isset($data->subject)) {
            $query .= ", subject = :subject";
        }
        if (isset($data->phone_number)) {
            $query .= ", phone_number = :phone_number";
        }
        
        $query .= " WHERE id = :id";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':name', $data->name);
        $stmt->bindParam(':email', $data->email);
        $stmt->bindParam(':id', $data->id);
        
        if (!empty($data->password)) {
            $password_hash = password_hash($data->password, PASSWORD_BCRYPT);
            $stmt->bindParam(':password', $password_hash);
        }
        
        // Bind student-specific fields
        if (isset($data->class_name)) {
            $stmt->bindParam(':class_name', $data->class_name);
        }
        if (isset($data->section)) {
            $stmt->bindParam(':section', $data->section);
        }
        if (isset($data->roll_number)) {
            $stmt->bindParam(':roll_number', $data->roll_number);
        }
        if (isset($data->subject)) {
            $stmt->bindParam(':subject', $data->subject);
        }
        if (isset($data->phone_number)) {
            $stmt->bindParam(':phone_number', $data->phone_number);
        }
        
        if ($stmt->execute()) {
            echo json_encode(array("message" => "Profile updated successfully."));
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "Unable to update profile."));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Incomplete data."));
    }
}
?>
