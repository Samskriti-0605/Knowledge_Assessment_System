<?php
include_once '../config/db.php';
handleCors();

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents("php://input"));

switch($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            // Get single assessment
            $query = "SELECT * FROM assessments WHERE id = :id";
            $stmt = $db->prepare($query);
            $stmt->bindParam(":id", $_GET['id']);
            $stmt->execute();
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if($row) {
                echo json_encode($row);
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "Assessment not found."));
            }
        } elseif (isset($_GET['teacher_id'])) {
            // Get assessments created by a specific teacher
            $query = "SELECT * FROM assessments WHERE created_by = :created_by ORDER BY created_at DESC";
            $stmt = $db->prepare($query);
            $stmt->bindParam(":created_by", $_GET['teacher_id']);
            $stmt->execute();
            $assessments = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($assessments);
        } elseif (isset($_GET['is_diagnostic']) && $_GET['is_diagnostic'] == 1) {
            // Get all diagnostic assessments for initial baseline
            $query = "SELECT a.*, u.name as created_by_name FROM assessments a JOIN users u ON a.created_by = u.id WHERE a.is_diagnostic = 1 ORDER BY a.created_at DESC";
            $stmt = $db->prepare($query);
            $stmt->execute();
            $assessments = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($assessments);
        } elseif (isset($_GET['class_name'])) {
            // STRICT FILTER: Get assessments for a specific class and section
            $section = isset($_GET['section']) ? $_GET['section'] : null;
            if ($section) {
                $query = "SELECT a.*, u.name as created_by_name FROM assessments a JOIN users u ON a.created_by = u.id 
                         WHERE a.class_name = :class_name AND a.section = :section AND a.is_diagnostic = 0 
                         ORDER BY a.created_at DESC";
                $stmt = $db->prepare($query);
                $stmt->bindParam(":class_name", $_GET['class_name']);
                $stmt->bindParam(":section", $section);
            } else {
                $query = "SELECT a.*, u.name as created_by_name FROM assessments a JOIN users u ON a.created_by = u.id 
                         WHERE a.class_name = :class_name AND a.is_diagnostic = 0 
                         ORDER BY a.created_at DESC";
                $stmt = $db->prepare($query);
                $stmt->bindParam(":class_name", $_GET['class_name']);
            }
            $stmt->execute();
            $assessments = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($assessments);
        } else {
            // No global fallback to prevent data leak between classes
            echo json_encode([]);
        }
        break;

    case 'POST':
        // Create assessment
        if (!empty($data->title) && !empty($data->created_by)) {
            $query = "INSERT INTO assessments (title, description, created_by, duration_minutes, class_name, section, category) VALUES (:title, :description, :created_by, :duration_minutes, :class_name, :section, :category)";
            $stmt = $db->prepare($query);
            
            $desc = isset($data->description) ? $data->description : "";
            $duration = isset($data->duration_minutes) ? $data->duration_minutes : 30;
            $class_name = isset($data->class_name) ? $data->class_name : null;
            $section = isset($data->section) ? $data->section : null;
            $category = isset($data->category) ? $data->category : "General Knowledge";
            
            $stmt->bindParam(":title", $data->title);
            $stmt->bindParam(":description", $desc);
            $stmt->bindParam(":created_by", $data->created_by);
            $stmt->bindParam(":duration_minutes", $duration);
            $stmt->bindParam(":class_name", $class_name);
            $stmt->bindParam(":section", $section);
            $stmt->bindParam(":category", $category);
            
            if ($stmt->execute()) {
                http_response_code(201);
                echo json_encode(array("message" => "Assessment created.", "id" => $db->lastInsertId()));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Unable to create assessment."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Incomplete data."));
        }
        break;

    case 'DELETE':
        // Delete assessment
        if (isset($_GET['id'])) {
            $query = "DELETE FROM assessments WHERE id = :id AND is_diagnostic = 0";
            $stmt = $db->prepare($query);
            $stmt->bindParam(":id", $_GET['id']);
            
            if ($stmt->execute()) {
                if ($stmt->rowCount() > 0) {
                    http_response_code(200);
                    echo json_encode(array("message" => "Assessment deleted."));
                } else {
                    http_response_code(403);
                    echo json_encode(array("message" => "This is a mandatory assessment and cannot be deleted."));
                }
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Unable to delete assessment."));
            }
        }
        break;
}
?>
