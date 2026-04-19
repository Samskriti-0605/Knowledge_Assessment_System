<?php
include_once '../config/db.php';
handleCors();

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents("php://input"));

if ($method == 'GET') {
    if (isset($_GET['id'])) {
        $query = "SELECT id, name, email, role, class_name, section, roll_number, subject, phone_number, delete_requested FROM users WHERE id = :id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':id', $_GET['id']);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode($user);
    } elseif (isset($_GET['class_name'])) {
        $query = "SELECT id, name, role, class_name, section, roll_number, subject, delete_requested FROM users WHERE class_name = :class_name";
        $params = [':class_name' => $_GET['class_name']];

        if (isset($_GET['section'])) {
            $query .= " AND section = :section";
            $params[':section'] = $_GET['section'];
        }

        if (isset($_GET['role'])) {
            $query .= " AND role = :role";
            $params[':role'] = $_GET['role'];
        }
        
        if (isset($_GET['delete_requested'])) {
            $query .= " AND delete_requested = :delete_requested";
            $params[':delete_requested'] = $_GET['delete_requested'];
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
    // Check for special actions
    if (isset($data->action)) {
        if ($data->action == 'request_deletion' && !empty($data->id)) {
            $query = "UPDATE users SET delete_requested = 1 WHERE id = :id";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':id', $data->id);
            if ($stmt->execute()) {
                echo json_encode(array("message" => "Deletion request sent to teacher."));
            } else {
                http_response_code(500);
                echo json_encode(array("message" => "Could not request deletion."));
            }
            exit;
        }
        if ($data->action == 'reject_deletion' && !empty($data->id)) {
            $query = "UPDATE users SET delete_requested = 0 WHERE id = :id";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':id', $data->id);
            if ($stmt->execute()) {
                echo json_encode(array("message" => "Deletion request rejected."));
            } else {
                http_response_code(500);
                echo json_encode(array("message" => "Could not reject request."));
            }
            exit;
        }
    }

    if (!empty($data->id) && !empty($data->name) && !empty($data->email)) {
        // ... (rest of the profile update logic)
        $query = "UPDATE users SET name = :name, email = :email";
        if (!empty($data->password)) $query .= ", password_hash = :password";
        if (isset($data->class_name)) $query .= ", class_name = :class_name";
        if (isset($data->section)) $query .= ", section = :section";
        if (isset($data->roll_number)) $query .= ", roll_number = :roll_number";
        if (isset($data->subject)) $query .= ", subject = :subject";
        if (isset($data->phone_number)) $query .= ", phone_number = :phone_number";
        
        $query .= " WHERE id = :id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':name', $data->name);
        $stmt->bindParam(':email', $data->email);
        $stmt->bindParam(':id', $data->id);
        
        if (!empty($data->password)) {
            $password_hash = password_hash($data->password, PASSWORD_BCRYPT);
            $stmt->bindParam(':password', $password_hash);
        }
        
        if (isset($data->class_name)) $stmt->bindValue(':class_name', trim($data->class_name));
        if (isset($data->section)) $stmt->bindValue(':section', trim($data->section));
        if (isset($data->roll_number)) $stmt->bindValue(':roll_number', trim($data->roll_number));
        if (isset($data->subject)) $stmt->bindParam(':subject', $data->subject);
        if (isset($data->phone_number)) $stmt->bindParam(':phone_number', $data->phone_number);
        
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
} elseif ($method == 'DELETE') {
    if (isset($_GET['id'])) {
        // Only actual deletion here if requested/approved logic is handled by teacher
        $query = "DELETE FROM users WHERE id = :id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':id', $_GET['id']);
        if ($stmt->execute()) {
            echo json_encode(array("message" => "Account permanently deleted."));
        } else {
            http_response_code(500);
            echo json_encode(array("message" => "Could not delete account."));
        }
    }
}
?>
