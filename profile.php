<?php
include "db.php";

// Get form data
$twitter = $_POST['twitter'] ?? '';
$linkedin = $_POST['linkedin'] ?? '';
$q1 = $_POST['q1'] ?? 0;
$q2 = $_POST['q2'] ?? 0;
$q3 = $_POST['q3'] ?? 0;

// Calculate cyber score (max 9 points)
$score = $q1 + $q2 + $q3;
$level = match(true) {
    $score >= 7 => 'Excellent',
    $score >= 5 => 'Good',
    $score >= 3 => 'Fair',
    default => 'Poor'
};

// Display results
echo "<h2>Your Cyber Security Assessment</h2>";
echo "<p>Your score: <strong>$score/9</strong></p>";
echo "<p>Security level: <strong>$level</strong></p>";

session_start();
$email = $_SESSION['email'] ?? 'test@example.com'; // Temporary for testing

$stmt = $conn->prepare("UPDATE users SET twitter=?, linkedin=?, cyber_score=? WHERE email=?");
$stmt->bind_param("ssis", $twitter, $linkedin, $score, $email);
$stmt->execute();
?>
