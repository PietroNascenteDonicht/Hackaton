
import { chat_send } from "../chat/api.js";

const text_chat = document.getElementById("question");
const submit_button = document.getElementById("send");
const messages = document.getElementById("messages");
const chat_form = document.getElementById("chat-form");

let historico = [];
let enviando = false;

async function chat_prepare() {
    const texto = text_chat.value.trim();

    if (!texto || enviando) {
        return;
    }

    enviando = true;
    submit_button.disabled = true;

    // Adiciona a mensagem do usuário ao histórico.
    historico.push({
        role: "user",
        content: texto,
    });

    // Mostra a mensagem do usuário na página.
    messages.innerHTML=''
    chat_att("usuario", texto);

    text_chat.value = "";

    const indicador = chat_create_typing_indicator();
    messages.appendChild(indicador);
    indicador.scrollIntoView({
        behavior: "smooth",
        block: "end",
    });

    try {
        const resposta = await chat_send(texto);

        indicador.remove();

        // Guarda a resposta real da IA.
        historico.push({
            role: "assistant",
            content: resposta,
        });

        // Mostra a resposta da IA na página.
        chat_att("assistente", resposta);

    } catch (erro) {
        console.error("Erro no chat:", erro);

        // Remove a mensagem do histórico se o envio falhar.
        historico.pop();

    } finally {
        indicador.remove();
        enviando = false;
        submit_button.disabled = false;
        text_chat.focus();
    }
}

function chat_create_message(tipo, texto) {
    const mensagem = document.createElement("div");
    mensagem.classList.add("chat-message", tipo);

    mensagem.innerHTML = ''

    const avatar = document.createElement("div");
    avatar.classList.add("message-avatar");
    avatar.textContent = tipo === "usuario" ? "Tu" : "IA";

    const conteudo = document.createElement("div");
    conteudo.classList.add("message-content");

    const autor = document.createElement("span");
    autor.classList.add("message-author");
    autor.textContent = tipo === "usuario" ? "Tu" : "Assistente";

    const bolha = document.createElement("div");
    bolha.classList.add("message-bubble");
    bolha.textContent = texto;

    conteudo.append(autor, bolha);

    if (tipo === "usuario") {
        mensagem.append(conteudo, avatar);
    } else {
        mensagem.append(avatar, conteudo);
    }

    return mensagem;
}

function chat_create_typing_indicator() {
    const mensagem = document.createElement("div");
    mensagem.classList.add("chat-message", "assistente", "typing-message");
    mensagem.setAttribute("role", "status");
    mensagem.setAttribute("aria-label", "Assistente está respondendo");

    const avatar = document.createElement("div");
    avatar.classList.add("message-avatar");
    avatar.textContent = "IA";

    const conteudo = document.createElement("div");
    conteudo.classList.add("message-content");

    const autor = document.createElement("span");
    autor.classList.add("message-author");
    autor.textContent = "Assistente";

    const bolha = document.createElement("div");
    bolha.classList.add("message-bubble", "typing-bubble");
    bolha.setAttribute("aria-hidden", "true");

    const pontos = document.createElement("span");
    pontos.classList.add("typing-dots");

    for (let i = 0; i < 3; i++) {
        const ponto = document.createElement("span");
        ponto.classList.add("typing-dot");
        pontos.appendChild(ponto);
    }

    bolha.appendChild(pontos);
    conteudo.append(autor, bolha);
    mensagem.append(avatar, conteudo);

    return mensagem;
}

// Adiciona a mensagem à section #messages.
function chat_att(tipo, texto) {
    const mensagem = chat_create_message(tipo, texto);

    messages.appendChild(mensagem);

    // Mantém a última mensagem visível.
    mensagem.scrollIntoView({
        behavior: "smooth",
        block: "end",
    });
}

chat_form.addEventListener("submit", (ev) => {
    ev.preventDefault();
    chat_prepare();
});

text_chat.addEventListener("keydown", (ev) => {
    if (ev.key === "Enter" && !ev.shiftKey) {
        ev.preventDefault();
        chat_prepare();
    }
});
