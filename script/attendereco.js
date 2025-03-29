const parametro = new URLSearchParams(window.location.search);
const id = parametro.get("id");
const urlBase = "https://go-wash-api.onrender.com/api/auth/address/" + id;
let user = JSON.parse(localStorage.getItem("user"));

async function pegarEndereco() {
  let api = await fetch(urlBase, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + user.access_token,
    },
  });

  let valores = await api.json();

  if (api.ok) {
    document.getElementById("titulo").value = valores.data.title;
    document.getElementById("cep").value = valores.data.cep;
    document.getElementById("resposta-endereco").value = valores.data.address;
    document.getElementById("numero").value = valores.data.number;
    document.getElementById("complemento").value = valores.data.complement;
  } else {
    alert("Ocorreu um erro desconhecido");
  }
}

pegarEndereco();

async function attEndereco() {
  if (user) {
    let titulo = document.getElementById("titulo").value;
    let cep = document.getElementById("cep").value;
    let endereco = document.getElementById("resposta-endereco").value;
    let numero = document.getElementById("numero").value;
    let complemento = document.getElementById("complemento").value;

    if (!titulo) {
      alert("Insira um título para seu endereço");
      return;
    }
    if (!cep || cep.length !== 8) {
      alert("Insira um CEP válido! (O CEP deve conter exatamente 8 dígitos)");
      erroValidacao();
      return;
    }

    if (!endereco) {
      alert("Valide um CEP para ter o endereço atualizado");
      return;
    }
    if (!numero) {
      alert("Insira o número da sua residência");
      return;
    }

    try {
      document.body.classList.add("wait-cursor");

      let api = await fetch(urlBase, {
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
          Authorization: "Bearer " + user.access_token,
        },
      });
      if (api.ok) {
        alert("Endereço atualizado com sucesso!");
        window.location.href = "home.html";
      }
    } catch (erro) {
      alert(
        "Ocorreu um erro ao tentar atualizar o endereço. Tente novamente..."
      );
    } finally {
      document.body.classList.remove("wait-cursor");
    }
  } else {
    alert("Nenhum usuário logado.");
    window.location.href = "login.html";
  }
}
