<?php
declare(strict_types=1);

include_once(__DIR__ . '/../helpers/env.php');

class ChatModel
{
    private string $endpoint;
    private string $modelo;
    private string $promptSistema;
    private int $timeout;

    public function __construct(
        string $modelo = 'llama3.2:3b',
        string $endpoint = 'http://127.0.0.1:11434',
        int $timeout = 180
    ) {
        $this->modelo = $modelo;
        $this->endpoint = rtrim($endpoint, '/');
        $this->timeout = $timeout;

        $this->promptSistema = Env::get('PROMPT_CHAT');
    }

    /**
     * Envia uma pergunta simples para a IA.
     */
    public function perguntar(string $pergunta): string
    {
        return $this->conversar([
            ['role' => 'user', 'content' => $pergunta]
        ]);
    }

    /**
     * Envia mensagens com histórico de conversa.
     *
     * @param array $mensagens
     * @return string Resposta gerada pela IA.
     */
    public function conversar(array $mensagens): string
    {
        if (empty($mensagens)) {
            throw new InvalidArgumentException(
                'A conversa precisa ter pelo menos uma mensagem.'
            );
        }

        $mensagensValidas = [];

        foreach ($mensagens as $mensagem) {
            if (
                !isset($mensagem['role'], $mensagem['content']) ||
                !in_array(
                    $mensagem['role'],
                    ['user', 'assistant'],
                    true
                ) ||
                !is_string($mensagem['content']) ||
                trim($mensagem['content']) === ''
            ) {
                throw new InvalidArgumentException(
                    'Mensagem inválida.'
                );
            }

            $mensagensValidas[] = [
                'role' => $mensagem['role'],
                'content' => $mensagem['content']
            ];
        }

        array_unshift($mensagensValidas, [
            'role' => 'system',
            'content' => $this->promptSistema
        ]);

        $dados = [
            'model' => $this->modelo,
            'messages' => $mensagensValidas,
            'stream' => false
        ];

        $resposta = $this->requisitar(
            '/api/chat',
            $dados
        );

        $conteudo = $resposta['message']['content'] ?? null;

        if (!is_string($conteudo)) {
            throw new RuntimeException(
                'O Ollama não retornou uma resposta válida.'
            );
        }

        return $conteudo;
    }

    /**
     * Lista os modelos instalados no Ollama.
     */
    public function listarModelos(): array
    {
        $resposta = $this->requisitar('/api/tags');

        return $resposta['models'] ?? [];
    }

    /**
     * Verifica se a API do Ollama está acessível.
     */
    public function estaDisponivel(): bool
    {
        try {
            $this->requisitar('/api/tags');
            return true;
        } catch (Throwable $erro) {
            return false;
        }
    }

    /**
     * Define o modelo utilizado nas próximas requisições.
     */
    public function definirModelo(string $modelo): void
    {
        if (trim($modelo) === '') {
            throw new InvalidArgumentException(
                'O nome do modelo não pode estar vazio.'
            );
        }

        $this->modelo = $modelo;
    }

    /**
     * Define as instruções gerais da IA.
     */
    public function definirPromptSistema(string $prompt): void
    {
        if (trim($prompt) === '') {
            throw new InvalidArgumentException(
                'O prompt do sistema não pode estar vazio.'
            );
        }

        $this->promptSistema = $prompt;
    }

    /**
     * Realiza requisições HTTP para a API do Ollama.
     */
    private function requisitar(
        string $rota,
        ?array $dados = null
    ): array {
        if (!function_exists('curl_init')) {
            throw new RuntimeException(
                'A extensão cURL do PHP não está habilitada.'
            );
        }

        $url = $this->endpoint . $rota;
        $curl = curl_init($url);

        $opcoes = [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CONNECTTIMEOUT => 5,
            CURLOPT_TIMEOUT => $this->timeout,
            CURLOPT_HTTPHEADER => [
                'Accept: application/json'
            ]
        ];

        if ($dados !== null) {
            $json = json_encode(
                $dados,
                JSON_UNESCAPED_UNICODE
            );

            if ($json === false) {
                curl_close($curl);

                throw new RuntimeException(
                    'Não foi possível preparar o JSON.'
                );
            }

            $opcoes[CURLOPT_POST] = true;
            $opcoes[CURLOPT_HTTPHEADER][] =
                'Content-Type: application/json';
            $opcoes[CURLOPT_POSTFIELDS] = $json;
        }

        curl_setopt_array($curl, $opcoes);

        $corpo = curl_exec($curl);
        $erro = curl_error($curl);
        $status = curl_getinfo(
            $curl,
            CURLINFO_HTTP_CODE
        );

        curl_close($curl);

        if ($corpo === false) {
            throw new RuntimeException(
                'Falha ao conectar ao Ollama: ' . $erro
            );
        }

        if ($status < 200 || $status >= 300) {
            throw new RuntimeException(
                "O Ollama retornou HTTP {$status}."
            );
        }

        $resultado = json_decode($corpo, true);

        if (!is_array($resultado)) {
            throw new RuntimeException(
                'O Ollama retornou um JSON inválido.'
            );
        }

        return $resultado;
    }
}
