/* =========================================================
   comum.js — código usado em todas as páginas
   - funções de apoio dos formulários
   - botão de olho (mostrar/ocultar senha)
   - fundo de reserva quando a foto não carrega
   Precisa ser carregado ANTES de login.js e cadastro.js
   ========================================================= */

/* ---------- Funções de apoio ---------- */

// Mostra (ou limpa) a mensagem de erro embaixo de um campo
function mostrarErro(input, mensagem) {
  const campo = input.closest(".campo");
  if (!campo) return;
  campo.classList.toggle("tem-erro", Boolean(mensagem));
  const alvo = campo.querySelector(".erro-msg");
  if (alvo) alvo.textContent = mensagem || "";
  input.setAttribute("aria-invalid", mensagem ? "true" : "false");
}

// Mostra a caixa de aviso no topo do formulário (verde = sucesso, vermelho = erro)
function mostrarAviso(form, mensagem, tipo = "sucesso") {
  const aviso = form.querySelector(".aviso");
  if (!aviso) return;
  aviso.textContent = mensagem;
  aviso.classList.toggle("aviso--erro", tipo === "erro");
  aviso.hidden = false;
}

// Confere se o texto tem formato de e-mail
function emailValido(valor) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor);
}

// Espera alguns milissegundos (usado para simular o servidor)
function esperar(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Desativa o botão, mostra "carregando…", executa a ação e restaura o botão
async function enviar(form, textoCarregando, acao) {
  const botao = form.querySelector('button[type="submit"]');
  const textoOriginal = botao.textContent;
  botao.disabled = true;
  botao.textContent = textoCarregando;
  try {
    await acao();
  } catch (erro) {
    console.error(erro);
    mostrarAviso(form, "Não foi possível concluir agora. Tente novamente em instantes.", "erro");
  } finally {
    botao.disabled = false;
    botao.textContent = textoOriginal;
  }
}

/* ---------- Mostrar / ocultar senha ---------- */

const ICONE_OLHO =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>';

const ICONE_OLHO_FECHADO =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M3 3l18 18"/><path d="M10.6 5.1A10 10 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4.1M6.3 6.3C3.6 8.1 2 12 2 12s3.5 7 10 7a9.7 9.7 0 0 0 5.7-1.8"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/></svg>';

/* ---------- Ao abrir a página ---------- */

document.addEventListener("DOMContentLoaded", () => {
  // Botão de olho: funciona em qualquer botão com data-alternar-senha="id-do-input"
  document.querySelectorAll("[data-alternar-senha]").forEach((botao) => {
    botao.addEventListener("click", () => {
      const input = document.getElementById(botao.dataset.alternarSenha);
      const visivel = input.type === "text";
      input.type = visivel ? "password" : "text";
      botao.innerHTML = visivel ? ICONE_OLHO : ICONE_OLHO_FECHADO;
      botao.setAttribute("aria-label", visivel ? "Mostrar senha" : "Ocultar senha");
    });
  });

  // Fotos: se assets/gestante.jpg não carregar, mostra um fundo em degradê
  document.querySelectorAll("img.foto").forEach((img) => {
    img.addEventListener("error", () => {
      img.removeAttribute("src");
      img.style.visibility = "hidden";
      img.parentElement.style.background = "linear-gradient(135deg, #efe6dc, #e3d6ea)";
    });
  });
});