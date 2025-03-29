let usuario = JSON.parse(localStorage.getItem("user"));
const url = "https://go-wash-api.onrender.com/api/auth/vehicle";

async function cadastrarVeiculo() {
  if (usuario) {
    let marca = document.getElementById("marca").value;
    let modelo = document.getElementById("modelo").value;
    let tipo = document.getElementById("tipo").value;
    let cor = document.getElementById("cor").value;
    let ano = document.getElementById("ano").value;

    if (!marca) {
      alert("Insira a marca para seu veículo");
      return;
    }
    if (!modelo) {
      alert("Insira o modelo para seu veículo");
      return;
    }
    if (!tipo) {
      alert("Insira o tipo do seu veículo");
      return;
    }
    if (!cor) {
      alert("Insira a cor do seu veículo");
      return;
    }
    if (!ano) {
      alert("Insira o ano do seu veículo");
      return;
    }

    const botao = document.getElementById("btn-cadastrar");

    try {
      botao.disabled = true;
      document.body.classList.add("wait-cursor");

      let api = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          type: tipo,
          brand: marca,
          model: modelo,
          color: cor,
          year: ano,
          size: "small",
        }),

        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + usuario.access_token,
        },
      });
      if (api.ok) {
        alert("Veículo cadastrado com sucesso!");
        window.location.href = "home.html";
      }
    } catch (erro) {
      alert(
        "Ocorreu um erro ao tentar cadastrar o veículo. Tente novamente..."
      );
    } finally {
      document.body.classList.remove("wait-cursor");
      botao.disabled = false;
    }
  } else {
    alert("Nenhum usuário logado.");
    window.location.href = "login.html";
  }
}
