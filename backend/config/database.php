<?php
include_once(__DIR__ . '/config/config.php');

$user = Env::get('DB_USER');
$password = Env::get('DB_PASS');
$host = Env::get('DB_HOST');
$dbname = Env::get('DB_NAME');

$dsn = "mysql:host=$host;dbname=$dbname;charset=utf8mb4";

try {
    $pdo = new PDO($dsn, $user, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
} catch (PDOException $e) {
    error_log($e->getMessage());

    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');

    echo json_encode([
        'success' => false,
        'message' => 'Erro interno do servidor'
    ]);

    exit;
}