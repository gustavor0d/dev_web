let user = JSON.parse(localStorage.getItem("user"));
const url = "https://go-wash-api.onrender.com/api/auth/address";

document.addEventListener("DOMContentLoaded", function () {
  if (user) {
    document.getElementById("nome").textContent = `, ${user.user.name}`;
  }
});

async function visualizarEnderecos() {
  if (user) {
    const botao = document.getElementById("btn-att");
    botao.disabled = true;

    document.body.classList.add("wait-cursor");

    try {
      let api = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + user.access_token,
        },
      });

      let resposta = await api.json();

      if (resposta.data.length === 0) {
        alert("Não foi encontrado nenhum endereço cadastrado!");
        location.reload();
        return;
      }

      const tbody = document.querySelector("#enderecos tbody");
      tbody.innerHTML = "";

      resposta.data.forEach((endereco) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
                <td id="id-endereco">${endereco.id}</td>
                <td>${endereco.title}</td>
                <td>${endereco.cep}</td>
                <td style="text-align: left;">${endereco.address} - Nº: ${endereco.number}</td>
                <td>${endereco.complement}</td>
                <td><a class="att" href="../view/attendereco.html?id=${endereco.id}">Atualizar</a> | <button id="btn-att" onclick="excluirEndereco(this)">Excluir</button></td>
            `;
        tbody.appendChild(tr);
      });
    } catch (erro) {
      alert("Ocorreu um erro ao buscar os endereços. Tente novamente...");
    } finally {
      document.body.classList.remove("wait-cursor");
      botao.disabled = false;
    }
  } else {
    alert("Nenhum usuário logado.");
    window.location.href = "login.html";
  }
}

async function excluirEndereco(excluir) {
  const id = excluir.closest("tr").querySelector("#id-endereco").innerText;

  let confirmacao = confirm(
    `Você está prestes a deletar este endereço (ID: ${id}). Confirmar ação?`
  );

  if (!confirmacao) {
    return;
  }

  document.body.classList.add("wait-cursor");

  let api = await fetch(url + "/" + id, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + user.access_token,
    },
  });

  if (api.ok) {
    document.body.classList.remove("wait-cursor");
    alert("Endereço deletado com sucesso!");
    visualizarEnderecos();
  }
}

async function deslogarUsuario() {
  if (user) {
    let confirmacao = confirm("Tem certeza que deseja deslogar?");

    if (!confirmacao) {
      return;
    }

    document.body.classList.add("wait-cursor");

    const url2 = "https://go-wash-api.onrender.com/api/auth/logout";

    let api = await fetch(url2, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + user.access_token,
      },
    });

    resposta = await api.json();

    if (resposta.data) {
      localStorage.removeItem("user");
      alert("Deslogado com sucesso!");
      window.location.href = "../index.html";
    }

    if (resposta.status) {
      alert("Nenhum usuário logado.");
      window.location.href = "login.html";
    }
    document.body.classList.remove("wait-cursor");
  } else {
    alert("Nenhum usuário logado.");
    window.location.href = "login.html";
  }
}

async function visualizarVeiculos() {
  const urlveiculo = "https://go-wash-api.onrender.com/api/auth/vehicle";

  if (user) {
    const botao = document.getElementById("btn-att");
    botao.disabled = true;

    document.body.classList.add("wait-cursor");

    try {
      let api = await fetch(urlveiculo, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + user.access_token,
        },
      });

      let resposta = await api.json();

      console.log(resposta);

      if (resposta.data.length === 0) {
        alert("Não foi encontrado nenhum veículo cadastrado!");
        location.reload();
        return;
      }

      const tbody = document.querySelector("#veiculos tbody");
      tbody.innerHTML = "";

      resposta.data.forEach((veiculo) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
                <td>${veiculo.id}</td>
                <td>${veiculo.brand}</td>
                <td>${veiculo.model}</td>
                <td>${veiculo.type}</td>
                <td>${veiculo.color}</td>
                <td>${veiculo.year}</td>
            `;
        tbody.appendChild(tr);
      });
    } catch (erro) {
      alert("Ocorreu um erro ao buscar os veículos. Tente novamente...");
    } finally {
      document.body.classList.remove("wait-cursor");
      botao.disabled = false;
    }
  } else {
    alert("Nenhum usuário logado.");
    window.location.href = "login.html";
  }
}
