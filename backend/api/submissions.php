<?php
include_once '../config/db.php';
handleCors();

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents("php://input"));

if ($method == 'POST') {
    // Submit assessment
    if (!empty($data->user_id) && !empty($data->assessment_id) && !empty($data->answers)) {
        // Calculate score
        $total_score = 0;
        $total_marks = 0;
        
        // Fetch correct answers
        $query = "SELECT id, correct_option, marks FROM questions WHERE assessment_id = :assessment_id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(":assessment_id", $data->assessment_id);
        $stmt->execute();
        $questions = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        foreach($questions as $question) {
            $qid = $question['id'];
            $total_marks += $question['marks'];
            
            // Check if user answered this question
            foreach($data->answers as $answer) {
                if ($answer->question_id == $qid && $answer->selected_option == $question['correct_option']) {
                   $total_score += $question['marks'];
                   break;
                }
            }
        }
        
        // Save submission
        $query = "INSERT INTO submissions SET user_id=:user_id, assessment_id=:assessment_id, score=:score, total_marks=:total_marks";
        $stmt = $db->prepare($query);
        $stmt->bindParam(":user_id", $data->user_id);
        $stmt->bindParam(":assessment_id", $data->assessment_id);
        $stmt->bindParam(":score", $total_score);
        $stmt->bindParam(":total_marks", $total_marks);
        
        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode(array(
                "message" => "Assessment submitted.",
                "score" => $total_score,
                "total_marks" => $total_marks
            ));
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "Unable to submit assessment."));
        }
    }
} elseif ($method == 'GET') {
    if (isset($_GET['user_id']) && isset($_GET['assessment_id'])) {
        // Check if a specific student completed a specific assessment
        $query = "SELECT s.* FROM submissions s WHERE s.user_id = :user_id AND s.assessment_id = :assessment_id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(":user_id", $_GET['user_id']);
        $stmt->bindParam(":assessment_id", $_GET['assessment_id']);
        $stmt->execute();
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    } elseif (isset($_GET['user_id'])) {
        // Get submissions for a student (all assessments)
        $query = "SELECT s.*, a.title as assessment_title FROM submissions s JOIN assessments a ON s.assessment_id = a.id WHERE s.user_id = :user_id ORDER BY s.submitted_at DESC";
        $stmt = $db->prepare($query);
        $stmt->bindParam(":user_id", $_GET['user_id']);
        $stmt->execute();
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    } elseif (isset($_GET['assessment_id'])) {
         // Get submissions for an assessment (Teacher view)
        $query = "SELECT s.*, u.name as student_name FROM submissions s JOIN users u ON s.user_id = u.id WHERE s.assessment_id = :assessment_id ORDER BY s.score DESC";
        $stmt = $db->prepare($query);
        $stmt->bindParam(":assessment_id", $_GET['assessment_id']);
        $stmt->execute();
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    } elseif (isset($_GET['leaderboard']) && isset($_GET['class_name']) && isset($_GET['section'])) {
        // Leaderboard: Top 4 students based on total score
        $query = "SELECT u.name, SUM(s.score) as total_score 
                  FROM users u 
                  JOIN submissions s ON u.id = s.user_id 
                  WHERE u.class_name = :class_name AND u.section = :section AND u.role = 'student' 
                  GROUP BY u.id 
                  ORDER BY total_score DESC 
                  LIMIT 4";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(":class_name", $_GET['class_name']);
        $stmt->bindParam(":section", $_GET['section']);
        $stmt->execute();
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    }
}
?>
