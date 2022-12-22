function showUserEditBox(user_id) {
  const xhttp = new XMLHttpRequest();

  xhttp.open("GET", "http://127.0.0.1:8080/users/" + user_id)
  xhttp.send();
  xhttp.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) {
      const object = JSON.parse(this.responseText);

      Swal.fire({
        title: 'Editar usuário',
        html:
          '<label> Nome:' +
          '<input id="user-name-edit" class="swal2-input" value="' + object["name"] + '">' +
          '<label> CPF:' +
          '<input id="cpf-edit" class="swal2-input" value="' + object["cpf"] + '">' +
          '<label> RG:' +
          '<input id="rg-edit" class="swal2-input" value="' + object["rg"] + '">' +
          '<label> Data de Nascimento:' +
          '<input id="birth-edit" type="date" class="swal2-input" value="' + object["birth"] + '">' +
          '<label> Data de Admissão:' +
          '<input id="admission-edit" type="date" class="swal2-input" value="' + object["admission"] + '">',
        focusConfirm: false,
        preConfirm: () => {
          userEdit(user_id);
        }
      })
    }
  }
}


function showUserCreateBox() {
  Swal.fire({
    title: 'Adicionar usuário',
    html:
      '<label> Nome:' +
      '<input id="user-name" class="swal2-input">' +
      '<label> CPF:' +
      '<input id="cpf" class="swal2-input">' +
      '<label> RG:' +
      '<input id="rg" class="swal2-input">' +
      '<label> Data de Nascimento:' +
      '<input id="birth" type="date" class="swal2-input">' +
      '<label> Data de Admissão:' +
      '<input id="admission" type="date" class="swal2-input">',
    focusConfirm: false,
    preConfirm: () => {
      userCreate();
    }
  })
}

function userCreate() {
  const name = document.getElementById("user-name").value
  const cpf = document.getElementById("cpf").value
  const rg = document.getElementById("rg").value
  const birth = document.getElementById("birth").value
  const admission = document.getElementById("admission").value

  const xhttp = new XMLHttpRequest();
  xhttp.open("POST", "http://127.0.0.1:8080/users");
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify({
    "name": name, "cpf": cpf, "rg": rg, "birth": birth, "admission": admission
  }));
  xhttp.onreadystatechange = function() {
    if (this.readyState === 4) {
      const objects = JSON.parse(this.responseText);
      if (this.status !== 201) {
        Swal.fire({icon: "error", text: objects["detail"]})
      } else {
        Swal.fire({icon: "success", text: "Usuário criado com sucesso"});
        loadTable();
      }
    }
  };
}


function userEdit(user_id) {
  const name = document.getElementById("user-name-edit").value
  const cpf = document.getElementById("cpf-edit").value
  const rg = document.getElementById("rg-edit").value
  const birth = document.getElementById("birth-edit").value
  const admission = document.getElementById("admission-edit").value

  const xhttp = new XMLHttpRequest();
  xhttp.open("PATCH", "http://127.0.0.1:8080/users/" + user_id);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify({
    "name": name, "cpf": cpf, "rg": rg, "birth": birth, "admission": admission
  }));
  xhttp.onreadystatechange = function() {
    if (this.readyState === 4) {
      if (this.status !== 204) {
        const objects = JSON.parse(this.responseText);
        Swal.fire({icon: "error", text: objects["detail"]})
      } else {
        Swal.fire({icon: "success", text: "Usuário atualizado com sucesso"});
        loadTable();
      }
    }
  };
}

function userDelete(id) {
  const xhttp = new XMLHttpRequest();
  xhttp.open("DELETE", "http://127.0.0.1:8080/users/" + id);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify({
    "id": id
  }));
  xhttp.onreadystatechange = function() {
    if (this.readyState === 4) {
      if (this.status !== 204) {
        const objects = JSON.parse(this.responseText);
        Swal.fire({icon: "error", text: objects["detail"]})
      } else {
        Swal.fire({icon: "success", text: "Usuário deletado com sucesso"});
        loadTable();
      }
    }
  };
}


function loadTable() {
  const xhttp_owners = new XMLHttpRequest()
  xhttp_owners.open("GET", "http://127.0.0.1:8080/users")
  xhttp_owners.send();
  xhttp_owners.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) {
      console.log(this.responseText);
      var trHTML = '';
      const objects = JSON.parse(this.responseText);
      for (let object of objects) {
        admission = new Date(object['admission'])

        trHTML += '<tr>'
        trHTML += '<td>' + object['name'] + '</td>'
        trHTML += '<td>' + (admission.getDay() + 1).toString().padStart(2, "0") + "/" + (admission.getMonth() + 1).toString().padStart(2, "0") + "/" + admission.getFullYear() + '</td>'
        trHTML += '<td><button type="button" class="btn btn-outline-danger" onclick="showUserEditBox(' + object['id'] + ')">Editar</button></td>'
        trHTML += '<td><button type="button" class="btn btn-outline-danger" onclick="userDelete(' + object['id'] + ')">Deletar</button></td>'
        trHTML += "</tr>"
      }
      document.getElementById("userstable").innerHTML = trHTML;
    }
  };
}

loadTable();