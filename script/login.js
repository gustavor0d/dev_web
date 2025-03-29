const urlLogin = "https://go-wash-api.onrender.com/api/login";

async function Login() {
  const botao = document.getElementById("btn-login");

  let usuario = document.getElementById("login").value;
  let senha = document.getElementById("pw").value;

  if (!usuario) {
    alert("O campo de CPF ou e-mail não foi preenchido");
    return;
  }

  if (!senha) {
    alert("O campo da senha não foi preenchida");
    return;
  }

  try {
    document.body.classList.add("wait-cursor");

    botao.disabled = true;

    let apiLogin = await fetch(urlLogin, {
      method: "POST",
      body: JSON.stringify({
        email: usuario,
        password: senha,
        user_type_id: 1,
      }),

      headers: {
        "Content-Type": "application/json",
      },
    });

    let resposta = await apiLogin.json();

    if (apiLogin.ok) {
      localStorage.setItem("user", JSON.stringify(resposta));
      alert("Logado com sucesso!");
      window.location.href = "home.html";
      return;
    }

    if (resposta.data && resposta.data.errors) {
      alert(resposta.data.errors);
      return;
    }
  } catch (erro) {
    alert("Ocorreu um erro ao logar. Tente novamente...");
  } finally {
    document.body.classList.remove("wait-cursor");
    botao.disabled = false;
  }
}

function exibirClima(clima) {
  const cardClima = document.getElementById("cardClima");

  document.getElementById("clima-texto").textContent = clima.condicao;
  document.getElementById(
    "temperatura"
  ).textContent = `Temperatura: ${clima.temperatura}°C`;
  document.getElementById("umidade").textContent = `Umidade: ${clima.umidade}%`;
  document.getElementById("vento").textContent = `Vento: ${clima.vento} km/h`;

  const climaImg = document.getElementById("clima-img");
  climaImg.src = `https:${clima.imagem}`;
  climaImg.style.display = "inline";
}

async function obterClima() {
  const chaveApi = "6963bd0c7798436aaaa170459242811";
  const url = `http://api.weatherapi.com/v1/current.json?key=${chaveApi}&q=São Paulo&lang=pt`;

  const resposta = await fetch(url);
  const dados = await resposta.json();

  const clima = {
    temperatura: dados.current.temp_c,
    condicao: dados.current.condition.text,
    imagem: dados.current.condition.icon,
    umidade: dados.current.humidity,
    vento: dados.current.wind_kph,
  };

  exibirClima(clima);
}

window.onload = function () {
  obterClima();
};
