/* =========================================================
   login.js — validação e envio do formulário de login
   Depende de: comum.js
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-login");
  if (!form) return; // não está na página de login

  const usuario = form.elements.usuario;
  const senha = form.elements.senha;

  // Limpa o erro assim que a pessoa começa a digitar
  [usuario, senha].forEach((input) =>
    input.addEventListener("input", () => mostrarErro(input, ""))
  );

  // "Esqueci minha senha"
  document.getElementById("esqueci-senha")?.addEventListener("click", (e) => {
    e.preventDefault();
    if (!usuario.value.trim()) {
      mostrarErro(usuario, "Digite seu e-mail ou usuário para recuperar a senha.");
      usuario.focus();
      return;
    }
    mostrarAviso(form, "Se houver uma conta com esses dados, enviaremos as instruções de recuperação para o e-mail cadastrado.");
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let valido = true;

    if (!usuario.value.trim()) {
      mostrarErro(usuario, "Informe seu e-mail ou nome de usuário.");
      valido = false;
    } else if (usuario.value.includes("@") && !emailValido(usuario.value)) {
      mostrarErro(usuario, "Digite um e-mail válido.");
      valido = false;
    }

    if (!senha.value) {
      mostrarErro(senha, "Informe sua senha.");
      valido = false;
    }

    if (!valido) {
      form.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }

    enviar(form, "Entrando…", async () => {
      // TODO: trocar pela chamada real à API de autenticação
      await esperar(800);
      mostrarAviso(form, "Login realizado! (simulação — conecte aqui ao back-end)");
    });
  });
});