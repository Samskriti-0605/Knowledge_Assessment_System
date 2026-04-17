<?php
require_once '../config/db.php';

$database = new Database();
$db = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Search student by roll number
    $roll_number = isset($_GET['roll_number']) ? $_GET['roll_number'] : null;
    
    if ($roll_number) {
        // Get student details
        $query = "SELECT id, name, email, class_name, section, roll_number FROM users WHERE roll_number=:roll_number AND role='student'";
        $stmt = $db->prepare($query);
        $stmt->bindParam(":roll_number", $roll_number);
        $stmt->execute();
        
        $student = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($student) {
            // Get student's submission history
            $query = "SELECT s.id, s.score, s.total_marks, s.submitted_at, a.title as assessment_title 
                     FROM submissions s 
                     JOIN assessments a ON s.assessment_id = a.id 
                     WHERE s.user_id = :user_id 
                     ORDER BY s.submitted_at DESC";
            $stmt = $db->prepare($query);
            $stmt->bindParam(":user_id", $student['id']);
            $stmt->execute();
            
            $submissions = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Calculate statistics
            $totalTests = count($submissions);
            $avgScore = 0;
            
            if ($totalTests > 0) {
                $totalPercentage = 0;
                foreach ($submissions as $sub) {
                    $totalPercentage += ($sub['score'] / $sub['total_marks']) * 100;
                }
                $avgScore = round($totalPercentage / $totalTests, 2);
            }
            
            echo json_encode(array(
                "student" => $student,
                "submissions" => $submissions,
                "statistics" => array(
                    "total_tests" => $totalTests,
                    "average_score" => $avgScore
                )
            ));
        } else {
            http_response_code(404);
            echo json_encode(array("message" => "Student not found with this roll number."));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Roll number is required."));
    }
}
?>
