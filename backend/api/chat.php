<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../controllers/chat.php';

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['erro' => 'Método não permitido.']);
        exit;
    }

    $dados = json_decode(
        file_get_contents('php://input'),
        true
    );

    $pergunta = $dados['mensagem'] ?? null;

    if (!is_string($pergunta) || trim($pergunta) === '') {
        http_response_code(400);
        echo json_encode(['erro' => 'Mensagem inválida.']);
        exit;
    }

    $controller = new ChatController();

    $resposta = $controller->perguntar($pergunta);

    echo json_encode(
        ['resposta' => $resposta],
        JSON_UNESCAPED_UNICODE
    );

} catch (Throwable $erro) {
    http_response_code(500);

    error_log((string) $erro);

    echo json_encode([
        'erro' => $erro->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
