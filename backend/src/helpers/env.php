<?php
declare(strict_types=1);

final class Env
{
    private static array $variables = [];
    private static bool $loaded = false;

    /**
     * Carrega as variáveis do arquivo .env.
     */
    public static function load(string $path): void
    {
        if (!is_file($path) || !is_readable($path)) {
            throw new RuntimeException(
                "Arquivo .env não encontrado ou sem permissão de leitura."
            );
        }

        $lines = file($path, FILE_IGNORE_NEW_LINES);

        if ($lines === false) {
            throw new RuntimeException("Não foi possível ler o arquivo .env.");
        }

        foreach ($lines as $line) {
            $line = trim($line);

            // Ignora linhas vazias e comentários.
            if ($line === '' || str_starts_with($line, '#')) {
                continue;
            }

            // Separa o nome da variável do valor.
            $separator = strpos($line, '=');

            if ($separator === false) {
                continue;
            }

            $key = trim(substr($line, 0, $separator));
            $value = trim(substr($line, $separator + 1));

            // Aceita somente nomes válidos de variáveis.
            if (!preg_match('/^[A-Za-z_][A-Za-z0-9_]*$/', $key)) {
                continue;
            }

            // Remove aspas externas, se existirem.
            if (
                strlen($value) >= 2 &&
                (
                    ($value[0] === '"' && str_ends_with($value, '"')) ||
                    ($value[0] === "'" && str_ends_with($value, "'"))
                )
            ) {
                $value = substr($value, 1, -1);
            }

            self::$variables[$key] = $value;
        }

        self::$loaded = true;
    }

    /**
     * Retorna uma variável ou um valor padrão.
     */
    public static function get(string $key, mixed $default = null): mixed
    {
        // Prioriza variáveis definidas no ambiente do sistema.
        $value = getenv($key);

        if ($value !== false) {
            return $value;
        }

        return self::$variables[$key] ?? $default;
    }

    /**
     * Retorna uma variável como boolean.
     */
    public static function bool(string $key, bool $default = false): bool
    {
        $value = self::get($key);

        if ($value === null) {
            return $default;
        }

        $parsed = filter_var($value, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);

        return $parsed ?? $default;
    }

    /**
     * Informa se o arquivo .env foi carregado.
     */
    public static function isLoaded(): bool
    {
        return self::$loaded;
    }
}
