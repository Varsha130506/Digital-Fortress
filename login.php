<?php
include "db.php";

$email = $_POST['email'];
$password = $_POST['password'];

$sql = "SELECT password FROM users WHERE email=?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows === 0) {
    echo "User not found";
    exit;
}

$stmt->bind_result($hash);
$stmt->fetch();

if (password_verify($password, $hash)) {
    echo "Login success";
} else {
    echo "Wrong password";
}
?>