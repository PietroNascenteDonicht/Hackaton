
import { chat_send } from "../chat/api.js";

const text_chat = document.getElementById("question");
const submit_button = document.getElementById("send");
const messages = document.getElementById("messages");

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
    chat_att("usuario", texto);

    text_chat.value = "";

    try {
        const resposta = await chat_send(texto);

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

submit_button.addEventListener("click", chat_prepare);

text_chat.addEventListener("keydown", (ev) => {
    if (ev.key === "Enter" && !ev.shiftKey) {
        ev.preventDefault();
        chat_prepare();
    }
});
