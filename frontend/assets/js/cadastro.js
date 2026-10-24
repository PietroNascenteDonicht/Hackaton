/* =========================================================
   cadastro.js — validação e envio do formulário de cadastro
   Depende de: comum.js
   ========================================================= */

// Regras de cada campo: devolvem "" se estiver certo, ou a mensagem de erro
const REGRAS_CADASTRO = {
  nome: (v) => {
    if (!v.trim()) return "Informe seu nome completo.";
    if (v.trim().split(/\s+/).length < 2) return "Digite nome e sobrenome.";
    return "";
  },
  usuario: (v) => {
    if (!v.trim()) return "Escolha um nome de usuário.";
    if (!/^[a-zA-Z0-9._]{3,20}$/.test(v)) return "Use de 3 a 20 caracteres: letras, números, ponto ou _.";
    return "";
  },
  email: (v) => {
    if (!v.trim()) return "Informe seu e-mail.";
    if (!emailValido(v)) return "Digite um e-mail válido.";
    return "";
  },
  senha: (v) => {
    if (!v) return "Crie uma senha.";
    if (v.length < 8 || !/[a-zA-Z]/.test(v) || !/\d/.test(v))
      return "A senha precisa ter 8 caracteres ou mais, com letras e números.";
    return "";
  },
  idade: (v) => {
    if (!v) return "Informe sua idade.";
    const n = Number(v);
    if (!Number.isInteger(n) || n < 10 || n > 60) return "Digite uma idade válida.";
    return "";
  },
  semanas: (v) => {
    if (!v) return "Informe as semanas de gestação.";
    const n = Number(v);
    if (!Number.isInteger(n) || n < 1 || n > 42) return "Digite um valor entre 1 e 42 semanas.";
    return "";
  },
};

function validarTermos(checkbox) {
  const ok = checkbox.checked;
  document.getElementById("check-termos").classList.toggle("tem-erro", !ok);
  const msg = checkbox.closest(".campo").querySelector(".erro-msg");
  msg.textContent = ok ? "" : "Você precisa aceitar os Termos de Uso e a Política de Privacidade.";
  return ok;
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-cadastro");
  if (!form) return; // não está na página de cadastro

  // Valida ao sair do campo; enquanto a pessoa corrige, atualiza o erro
  Object.keys(REGRAS_CADASTRO).forEach((nome) => {
    const input = form.elements[nome];
    const regra = REGRAS_CADASTRO[nome];
    input.addEventListener("blur", () => mostrarErro(input, regra(input.value)));
    input.addEventListener("input", () => {
      if (input.closest(".campo").classList.contains("tem-erro")) {
        mostrarErro(input, regra(input.value));
      }
    });
  });

  const termos = form.elements.termos;
  termos.addEventListener("change", () => validarTermos(termos));

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let primeiroInvalido = null;

    Object.keys(REGRAS_CADASTRO).forEach((nome) => {
      const input = form.elements[nome];
      const erro = REGRAS_CADASTRO[nome](input.value);
      mostrarErro(input, erro);
      if (erro && !primeiroInvalido) primeiroInvalido = input;
    });

    if (!validarTermos(termos) && !primeiroInvalido) primeiroInvalido = termos;

    if (primeiroInvalido) {
      primeiroInvalido.focus();
      return;
    }

    const dados = {
      nome: form.elements.nome.value.trim(),
      usuario: form.elements.usuario.value.trim(),
      email: form.elements.email.value.trim(),
      idade: Number(form.elements.idade.value),
      semanasGestacao: Number(form.elements.semanas.value),
      tipoConta: form.elements.tipoConta.value,
    };

    enviar(form, "Criando sua conta…", async () => {
      // TODO: trocar pela chamada real à API, ex.:
      // await fetch("/api/cadastro", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ ...dados, senha: form.elements.senha.value }),
      // });
      await esperar(900);
      console.log("Cadastro (simulado):", dados);
      mostrarAviso(form, `Conta criada com sucesso, ${dados.nome.split(" ")[0]}! Redirecionando para o login…`);
      setTimeout(() => (window.location.href = "login.html"), 1800);
    });
  });
});