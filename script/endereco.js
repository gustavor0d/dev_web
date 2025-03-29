let usuario = JSON.parse(localStorage.getItem("user"));
const url = "https://go-wash-api.onrender.com/api/auth/address";

function erroValidacao() {
  localStorage.removeItem("cep");
  document.getElementById("cep").value = "";
  document.getElementById("resposta-endereco").value = "";
  document.getElementById("localidade").value = "";
  document.getElementById("uf").value = "";
}

async function viaCep(cep) {
  const url = "https://viacep.com.br/ws/" + cep + "/json/";

  let api = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  let resposta = await api.json();

  if (resposta.erro) {
    alert("O CEP informado é inexistente");
    erroValidacao();
    return;
  }

  document.getElementById("resposta-endereco").value =
    resposta.logradouro + ", " + resposta.bairro;
  document.getElementById("localidade").value = resposta.localidade;
  document.getElementById("uf").value = resposta.uf;

  localStorage.setItem("cep", cep);
}

function verificar() {
  let cep = document.getElementById("cep").value;

  if (!cep || cep.length !== 8) {
    alert("Insira um CEP válido! (O CEP deve conter exatamente 8 dígitos)");
    erroValidacao();
    return;
  }
  viaCep(cep);
}

async function cadastrarEndereco() {
  if (usuario) {
    const botao = document.getElementById("btn-cadastrar");

    let titulo = document.getElementById("titulo").value;
    let cep = document.getElementById("cep").value;
    let endereco = document.getElementById("resposta-endereco").value;
    let numero = document.getElementById("numero").value;
    let complemento = document.getElementById("complemento").value;

    let cepVerificado = localStorage.getItem("cep");

    if (!titulo) {
      alert("Insira um título para seu endereço");
      return;
    }
    if (!cep || cep.length !== 8) {
      alert("Insira um CEP válido! (O CEP deve conter exatamente 8 dígitos)");
      erroValidacao();
      return;
    }
    if (cepVerificado) {
      if (cep !== cepVerificado) {
        alert(
          "O CEP foi alterado após a verificação. Por favor, verifique o CEP novamente"
        );
        erroValidacao();
        return;
      }
    }
    if (!endereco) {
      alert("Valide um CEP existente para ter um endereço cadastrado");
      return;
    }
    if (!numero) {
      alert("Insira o número da sua residência");
      return;
    }

    try {
      botao.disabled = true;
      document.body.classList.add("wait-cursor");

      let api = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          title: titulo,
          cep: cep,
          address: endereco,
          number: numero,
          complement: complemento,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + usuario.access_token,
        },
      });
      if (api.ok) {
        alert("Endereço cadastrado com sucesso!");
        window.location.href = "home.html";
      }
    } catch (erro) {
      alert(
        "Ocorreu um erro ao tentar cadastrar o endereço. Tente novamente..."
      );
    } finally {
      localStorage.removeItem("cep");
      document.body.classList.remove("wait-cursor");
      botao.disabled = false;
    }
  } else {
    alert("Nenhum usuário logado.");
    window.location.href = "login.html";
  }
}
