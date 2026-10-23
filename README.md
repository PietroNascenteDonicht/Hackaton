# Hackaton — Guia de Estrutura do Frontend

## 1. Sobre o projeto

Este projeto está dividido em duas partes principais:

- **Frontend:** tudo o que o usuário vê e utiliza no site.
- **Backend:** responsável pelo processamento dos dados, pelas regras do sistema, pela comunicação com o banco de dados e pela API.

O frontend será desenvolvido com **HTML, CSS e JavaScript puro**, sem frameworks ou bibliotecas obrigatórias.

O backend utiliza **PHP puro**, com comunicação por meio de uma API HTTP que retorna dados em JSON.

## 2. Estrutura de pastas

```text
Hackaton/
│
├── frontend/                  # Toda a interface do site
│   │
│   ├── index.html              # Página inicial
│   ├── README.md               # Orientações específicas do frontend
│   │
│   ├── pages/                  # Páginas adicionais do sistema
│   │
│   ├── components/             # Componentes reutilizáveis
│   │
│   └── assets/
│       │
│       ├── css/                # Estilos visuais
│       │   ├── variables.css   # Cores, fontes e variáveis
│       │   ├── global.css      # Estilos gerais
│       │   ├── layout.css      # Organização e posicionamento
│       │   └── components.css  # Estilos dos componentes
│       │
│       ├── js/                 # Funcionalidades JavaScript
│       │   ├── config.js       # Configurações do frontend
│       │   ├── api.js          # Comunicação com o backend
│       │   └── app.js          # Inicialização e lógica geral
│       │
│       └── images/             # Imagens, logos e ícones
│
├── backend/                    # API e processamento PHP
│   ├── public/                 # Ponto de entrada público da API
│   ├── config/                 # Configurações do backend
│   ├── src/                    # Classes e lógica do sistema
│   ├── routes/                 # Definição das rotas da API
│   ├── database/               # Scripts SQL
│   └── storage/                # Arquivos internos, como logs
│
├── docs/                       # Documentação do projeto
│
├── .gitignore
└── README.md
```

## 3. Onde desenvolver cada parte do frontend?

### `frontend/index.html`

É a página inicial do projeto.

Utilize esse arquivo para montar a estrutura HTML da página principal e importar os arquivos CSS e JavaScript necessários.

### `frontend/pages/`

Guarda as páginas adicionais do sistema.

Exemplos:

- `login.html` — tela de login.
- `cadastro.html` — tela de cadastro.
- `dashboard.html` — painel principal.
- `perfil.html` — página de perfil.

Cada página deve ter uma responsabilidade clara.

### `frontend/components/`

Guarda elementos visuais que podem ser reutilizados em diferentes páginas.

Exemplos:

- Cabeçalho e menu de navegação.
- Barra lateral.
- Cartões de informação.
- Botões personalizados.
- Modais e janelas de confirmação.

Antes de criar o mesmo elemento em várias páginas, verifique se faz sentido transformá-lo em um componente reutilizável.

Como o projeto utiliza JavaScript puro, esses componentes podem ser implementados como arquivos HTML, funções JavaScript ou pequenos módulos, conforme a necessidade.

### `frontend/assets/css/`

Os arquivos CSS estão separados por finalidade.

| Arquivo | Responsabilidade |
|---|---|
| `variables.css` | Cores, fontes, espaçamentos e outras variáveis visuais. |
| `global.css` | Estilos básicos, tipografia e regras gerais. |
| `layout.css` | Organização das páginas, colunas, menus e áreas de conteúdo. |
| `components.css` | Aparência de botões, cartões, formulários e outros componentes. |

Essa organização facilita alterar o visual do sistema sem precisar modificar o HTML de todas as páginas.

### `frontend/assets/js/`

Guarda o JavaScript responsável pelo comportamento do site.

| Arquivo | Responsabilidade |
|---|---|
| `config.js` | Configurações compartilhadas, como a URL-base da API. |
| `api.js` | Funções para enviar requisições HTTP ao backend e tratar as respostas. |
| `app.js` | Inicialização da aplicação e funcionalidades gerais da página. |

Funcionalidades específicas podem ser organizadas em arquivos JavaScript adicionais, quando necessário.

### `frontend/assets/images/`

Guarda os recursos visuais do site, como:

- Logotipos.
- Fotografias.
- Ilustrações.
- Ícones próprios.
- Imagens utilizadas em cartões ou banners.

Evite colocar imagens diretamente na raiz do projeto.

## 4. Como trabalhar com um layout do Figma

Se você receber um layout pronto no Figma, utilize o seguinte fluxo:

1. **Analise o layout:** identifique as páginas, os componentes, as cores, as fontes e os espaçamentos.
2. **Monte o HTML:** organize os elementos usando HTML semântico.
3. **Implemente o CSS:** utilize os arquivos existentes para reproduzir o visual do design.
4. **Adicione as interações:** implemente menus, formulários, botões e validações com JavaScript.
5. **Conecte a API:** utilize as funções de `api.js` para obter ou enviar dados ao backend.
6. **Teste a responsividade:** verifique se a interface funciona em telas de computador e celular.

Procure reproduzir o design recebido com fidelidade, mantendo o código organizado e reutilizável.

## 5. Como o frontend se comunica com o backend?

O frontend não deve acessar o banco de dados diretamente.

A comunicação acontece por requisições HTTP à API do backend, que processa a solicitação e devolve uma resposta, normalmente em JSON.

Exemplo simplificado:

```text
Usuário
   |
   v
Frontend (HTML, CSS e JavaScript)
   |
   | Requisição HTTP
   v
Backend (PHP)
   |
   v
Banco de dados
   |
   v
Backend retorna JSON
   |
   v
Frontend atualiza a interface
```

Para realizar essas requisições, utilize `frontend/assets/js/api.js`.

A URL-base da API deve ficar centralizada em `frontend/assets/js/config.js`, para que seja fácil alterá-la conforme o ambiente.

Não coloque senhas, credenciais do banco de dados ou outras informações privadas no frontend.

## 6. Regras de organização

Para manter o projeto fácil de entender durante o hackathon:

- Utilize HTML, CSS e JavaScript puro.
- Não instale frameworks ou bibliotecas sem combinar com a equipe.
- Mantenha os arquivos nas pastas correspondentes às suas responsabilidades.
- Reutilize componentes quando isso simplificar o código.
- Evite colocar todo o CSS em um único arquivo ou toda a lógica em um único JavaScript.
- Utilize nomes claros para arquivos, classes, funções e variáveis.
- Mantenha o frontend independente dos detalhes internos do PHP.
- Não altere os arquivos do backend sem necessidade ou alinhamento com quem está trabalhando nele.
- Não coloque informações sensíveis no código público.

## 7. Importante para a equipe

A estrutura inicial serve como ponto de partida. É permitido criar novos arquivos e subpastas quando o projeto precisar, desde que a organização continue clara.

**Objetivo:** permitir que qualquer integrante da equipe consiga localizar rapidamente os arquivos da interface, desenvolver novas páginas, adaptar layouts do Figma e integrar funcionalidades à API sem precisar entender todo o backend.