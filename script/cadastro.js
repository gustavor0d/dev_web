const url = "https://go-wash-api.onrender.com/api/user";

async function cadastroUsuario() {
  const botao = document.getElementById("btn-cadastro");

  let nome = document.getElementById("name").value;
  let email = document.getElementById("email").value;
  let senha = document.getElementById("pw").value;
  let cpf_cnpj = document.getElementById("cpf_cnpj").value;
  let nascimento = document.getElementById("birthday").value;
  let termos = document.getElementById("terms").checked;

  if (!nome) {
    alert("O nome de usuário não foi preenchido");
    return;
  }

  if (!email) {
    alert("O e-mail não foi preenchido");
    return;
  }

  if (!senha) {
    alert("A senha não foi preenchida");
    return;
  }

  if (!cpf_cnpj) {
    alert("CPF ou CNPJ não foi preenchido");
    return;
  }

  if (!nascimento) {
    alert("A data de nascimento não foi preenchida");
    return;
  }

  if (!termos) {
    alert(
      "Aceite os termos de consentimento para dar continuidade no cadastro!"
    );
    return;
  }

  try {
    document.body.classList.add("wait-cursor");

    botao.disabled = true;

    let api = await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        name: nome,
        email: email,
        user_type_id: 1,
        password: senha,
        cpf_cnpj: cpf_cnpj,
        terms: 1,
        birthday: nascimento,
      }),

      headers: {
        "Content-Type": "application/json",
      },
    });

    let resposta = await api.json();

    if (api.ok) {
      alert(resposta.data);
      window.location.href = "login.html";
      return;
    } else {
      if (resposta.data.errors === "cpf_cnpj invalid") {
        alert("CPF ou CNPJ inválido");
      } else {
        if (resposta.data.errors.email) {
          alert("E-mail já cadastrado");
        } else if (resposta.data.errors.cpf_cnpj) {
          alert("CPF ou CNPJ já cadastrado");
        } else if (resposta.data.errors.password) {
          alert("A senha deve conter no mínimo 6 caracteres");
        } else if (resposta.data.errors.birthday) {
          alert("A data de nascimento não está preenchida corretamente");
        } else {
          alert("Erro desconhecido, tente novamente!");
        }
      }
    }
  } catch (erro) {
    alert("Ocorreu um erro ao se registrar. Tente novamente...");
  } finally {
    document.body.classList.remove("wait-cursor");
    botao.disabled = false;
  }
}
