const BASE_API_URL = "https://mock-api.driven.com.br/api/v6/uol";

let userName;

function login() {
  userName = document.querySelector(".login-input").value;

  let promise = axios.post(`${BASE_API_URL}/participants`, { name: userName });

  promise.then(logsTheUserIn);
  promise.catch(throwErrors);
}

function logsTheUserIn() {
  document.querySelector(".login-screen").classList.add("hidden");
  reloadMessages();
}

function throwErrors(err) {
  let error = err.response.status;

  if (userName === "" && error === 400) {
    alert(`Erro ${error}! Campo em branco, digite seu usuário`);
  } else if (error === 400) {
    alert(`Erro ${error}! Este usuário já existe, digite um novo nome`);
  }
}

function reloadMessages() {
  getMessages();
  setInterval(getMessages, 3000);
  setInterval(keepConected, 5000);
}

function keepConected() {
  let promise = axios.post(`${BASE_API_URL}/status`, {
    name: userName,
  });
}

function getMessages() {
  const promise = axios.get(`${BASE_API_URL}/messages`);
  promise.then(function (response) {
    let divMessages = document.querySelector(".container-messages");
    divMessages.innerHTML = "";

    for (let i = 0; i < response.data.length; i++) {
      switch (response.data[i].type) {
        case "status":
          divMessages.innerHTML += `
            <div class="status-message">
              <div class="display-message">
                <p class="message">
                  <span class="time">(${response.data[i].time})</span>
                  <span class="message">
                    <b class="bold-text">${response.data[i].from}</b>
                    ${response.data[i].text}
                  </span>
                </p>
              </div>
            </div>
          `;
          break;

        case "message":
          divMessages.innerHTML += `
            <div class="regular-message">
              <div class="display-message">
                <p class="message">
                <span class="time">(${response.data[i].time})</span>
                <span class="message">
                  <b class="bold-text">${response.data[i].from}</b>
                  para
                  <b class="bold-text">${response.data[i].to}</b>:
                    ${response.data[i].text}</span>
                </p>
              </div>
            </div>
          `;
          break;

        case "private_message":
          if (
            response.data[i].from === userName ||
            response.data[i].to === userName
          )
            divMessages.innerHTML += `
              <div class="private-message">
                <div class="display-message">
                  <span class="time">(${response.data[i].time})</span>
                    <span class="message">
                        <b class="bold-text">${response.data[i].from}</b> reservadamente
                        para <b class="bold-text">${response.data[i].to}</b>:
                        ${response.data[i].text}
                    </span>
                </div>
              </div>
            `;
          break;
      }
      scrollMessages();
    }
  });
}

function scrollMessages() {
  document
    .querySelector(".container-messages")
    .lastElementChild.scrollIntoView();
}

function sendMessages() {
  let userMessage = document.querySelector(".send-message-input").value;

  let promise = axios.post(`${BASE_API_URL}/messages`, {
    from: userName,
    to: "Todos",
    text: userMessage,
    type: "message",
  });

  promise.then((response) => console.log(response.status));
  promise.catch(() => window.location.reload());

  userMessage = "";
}

function sidebarOn() {
  click = document.querySelector(".sidebar");
  if (click !== null) {
    click.classList.remove("hidden");
  }
}

function sidebarOff() {
  document.querySelector(".sidebar").classList.add("hidden");
}
