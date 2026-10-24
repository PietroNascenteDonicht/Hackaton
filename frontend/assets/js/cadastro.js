// Regras de validação dos campos
const REGRAS_CADASTRO = {
  nome: (v) => {
    if (!v.trim()) return "Informe seu nome completo.";
    if (v.trim().split(/\s+/).length < 2)
      return "Digite nome e sobrenome.";
    return "";
  },

  usuario: (v) => {
    if (!v.trim()) return "Escolha um nome de usuário.";
    if (!/^[a-zA-Z0-9._]{3,20}$/.test(v))
      return "Use de 3 a 20 caracteres: letras, números, ponto ou _.";
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
    if (!Number.isInteger(n) || n < 10 || n > 60)
      return "Digite uma idade válida.";
    return "";
  },

  semanas: (v) => {
    if (!v) return "Informe as semanas de gestação.";
    const n = Number(v);
    if (!Number.isInteger(n) || n < 1 || n > 42)
      return "Digite um valor entre 1 e 42 semanas.";
    return "";
  }
};

// Validação dos termos de uso
function validarTermos(checkbox) {
  const ok = checkbox.checked;

  document.getElementById("check-termos")
    .classList.toggle("tem-erro", !ok);

  const msg = checkbox.closest(".campo").querySelector(".erro-msg");

  msg.textContent = ok
    ? ""
    : "Você precisa aceitar os Termos de Uso e a Política de Privacidade.";

  return ok;
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-cadastro");

  if (!form) return;

  // Valida os campos ao sair deles
  Object.keys(REGRAS_CADASTRO).forEach((nome) => {
    const input = form.elements[nome];
    const regra = REGRAS_CADASTRO[nome];

    input.addEventListener("blur", () => {
      mostrarErro(input, regra(input.value));
    });

    input.addEventListener("input", () => {
      if (input.closest(".campo").classList.contains("tem-erro")) {
        mostrarErro(input, regra(input.value));
      }
    });
  });

  // Valida os termos
  const termos = form.elements.termos;

  termos.addEventListener("change", () => {
    validarTermos(termos);
  });

  // Envio do formulário
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    let primeiroInvalido = null;

    // Verifica todos os campos
    Object.keys(REGRAS_CADASTRO).forEach((nome) => {
      const input = form.elements[nome];
      const erro = REGRAS_CADASTRO[nome](input.value);

      mostrarErro(input, erro);

      if (erro && !primeiroInvalido) {
        primeiroInvalido = input;
      }
    });

    // Verifica os termos
    if (!validarTermos(termos) && !primeiroInvalido) {
      primeiroInvalido = termos;
    }

    // Se houver erro, não envia
    if (primeiroInvalido) {
      primeiroInvalido.focus();
      return;
    }

    // Organiza os dados
    const dados = {
      nome: form.elements.nome.value.trim(),
      usuario: form.elements.usuario.value.trim(),
      email: form.elements.email.value.trim(),
      senha: form.elements.senha.value,
      idade: Number(form.elements.idade.value),
      semanasGestacao: Number(form.elements.semanas.value),
      tipoConta: form.elements.tipoConta.value
    };

    try {
      mostrarAviso(form, "Enviando dados para teste...");

      // Envia os dados para um serviço de teste
      const resposta = await fetch("https://httpbin.org/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dados)
      });

      if (!resposta.ok) {
        throw new Error("O servidor retornou um erro: " + resposta.status);
      }

      const resultado = await resposta.json();

      // Mostra os dados no Console
      console.log("Dados enviados:", dados);
      console.log("Dados recebidos pelo servidor:", resultado.json);

      mostrarAviso(form, "Teste realizado! Confira o Console (F12).");

    } catch (erro) {
      mostrarAviso(
        form,
        "Não foi possível realizar o teste. Confira o Console."
      );

      console.error("Erro no teste do fetch:", erro);
    }
  });
});