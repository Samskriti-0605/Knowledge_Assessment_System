<?php
include_once '../config/db.php';
handleCors();

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents("php://input"));

switch($method) {
    case 'GET':
        if (isset($_GET['assessment_id'])) {
            $query = "SELECT * FROM questions WHERE assessment_id = :assessment_id";
            $stmt = $db->prepare($query);
            $stmt->bindParam(":assessment_id", $_GET['assessment_id']);
            $stmt->execute();
            $questions = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($questions);
        }
        break;

    case 'POST':
        if (!empty($data->assessment_id) && !empty($data->question_text) && !empty($data->correct_option)) {
            // Check if assessment is diagnostic
            $check = $db->prepare("SELECT is_diagnostic FROM assessments WHERE id = :id");
            $check->execute([':id' => $data->assessment_id]);
            $assessment = $check->fetch(PDO::FETCH_ASSOC);

            if ($assessment && $assessment['is_diagnostic'] == 1) {
                http_response_code(403);
                echo json_encode(array("message" => "Cannot add questions to a mandatory diagnostic assessment."));
                break;
            }

            $query = "INSERT INTO questions SET assessment_id=:assessment_id, question_text=:question_text, option_a=:option_a, option_b=:option_b, option_c=:option_c, option_d=:option_d, correct_option=:correct_option, marks=:marks";
            $stmt = $db->prepare($query);
            
            $marks = isset($data->marks) ? $data->marks : 1;
            
            $stmt->bindParam(":assessment_id", $data->assessment_id);
            $stmt->bindParam(":question_text", $data->question_text);
            $stmt->bindParam(":option_a", $data->option_a);
            $stmt->bindParam(":option_b", $data->option_b);
            $stmt->bindParam(":option_c", $data->option_c);
            $stmt->bindParam(":option_d", $data->option_d);
            $stmt->bindParam(":correct_option", $data->correct_option);
            $stmt->bindParam(":marks", $marks);
            
            if ($stmt->execute()) {
                http_response_code(201);
                echo json_encode(array("message" => "Question created."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Unable to create question."));
            }
        }
        break;

    case 'DELETE':
        if (isset($_GET['id'])) {
            // Get assessment_id first
            $check = $db->prepare("SELECT a.is_diagnostic FROM assessments a JOIN questions q ON a.id = q.assessment_id WHERE q.id = :id");
            $check->execute([':id' => $_GET['id']]);
            $assessment = $check->fetch(PDO::FETCH_ASSOC);

            if ($assessment && $assessment['is_diagnostic'] == 1) {
                http_response_code(403);
                echo json_encode(array("message" => "Cannot delete questions from a mandatory diagnostic assessment."));
                break;
            }

            $query = "DELETE FROM questions WHERE id = :id";
            $stmt = $db->prepare($query);
            $stmt->bindParam(":id", $_GET['id']);
            if ($stmt->execute()) {
                http_response_code(200);
                echo json_encode(array("message" => "Question deleted."));
            }
        }
        break;
}
?>
