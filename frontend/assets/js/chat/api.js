export {chat_send};

async function chat_send(mensagem) {
    const resposta = await fetch('/hackathon/backend/api/chat.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ mensagem: mensagem }),
    });

    const data = await resposta.json();

    if (!resposta.ok) {
        throw new Error(data.erro || `Erro HTTP ${resposta.status}`);
    }

    return data.resposta;
}