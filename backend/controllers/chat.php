<?php
declare(strict_types=1);

require_once __DIR__ . '/../models/chat.php';

class ChatController
{
    private ChatModel $chat;

    public function __construct()
    {
        $this->chat = new ChatModel();
    }

    public function perguntar(string $pergunta): string
    {
        return $this->chat->perguntar($pergunta);
    }
}
