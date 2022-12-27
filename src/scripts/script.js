const THREE_SECONDS = 3000;
const FIVE_SECONDS = 5000;
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
  loadMessages();
}

function throwErrors(err) {
  let error = err.response.status;

  if (userName === "" && error === 400) {
    alert(`Erro ${error}! Campo em branco, digite seu usuário`);
  } else if (error === 400) {
    alert(`Erro ${error}! Este usuário já existe, digite um novo nome`);
  }
}

function loadMessages() {
  getMessages();
  setInterval(getMessages, THREE_SECONDS);
  setInterval(keepConnected, FIVE_SECONDS);
}

function keepConnected() {
  let promise = axios.post(`${BASE_API_URL}/status`, { name: userName });

  promise.then((res) => {
    const { status, statusText } = res;
    console.info(
      `%c${status}, ${statusText} - Usuário continua logado`,
      "color: blue; font-weight: bold; font-size: 15px; line-height: 25px;"
    );
  });
  promise.catch((err) => {
    const error = err.response.status;
    alert(`Erro ${error}. Usuário desconectado por inatividade`);
  });
}

function getMessages() {
  const promise = axios.get(`${BASE_API_URL}/messages`);

  promise.then((res) => {
    createsTheMessages(res.data);
    scrollMessages();
  });
  promise.catch((err) => {
    const { status, data } = err.response;
    alert(`${data} Erro ${status} - Problema ao carregar as mensagens do chat`);
    window.location.reload();
  });
}

function createsTheMessages(allMessages) {
  let divMessages = document.querySelector(".container-messages");

  allMessages.forEach((message) => {
    const { from, time, text, to, type } = message;

    switch (type) {
      case "status":
        divMessages.innerHTML += `
          <li class="display-message status-message">
            <span class="message">
              <span class="time">(${time})</span>
              <span class="users"><b class="bold-text">${from}</b></span>
              <span class="text">${text}</span>
            </span>
          </li>
        `;
        break;

      case "message":
        divMessages.innerHTML += `
          <li class="display-message regular-message">
            <span class="message">
              <span class="time">(${time})</span>
              <span class="users">
                <b class="bold-text">${from}</b> para <b class="bold-text">${to}</b>:
              </span>
              <span class="text"> ${text}</span>
            </span>
          </li>
        `;
        break;

      case "private_message":
        if (from === userName || to === userName) {
          divMessages.innerHTML += `
            <li class="display-message private-message">
              <span class="message">
                <span class="time">(${time})</span>
                <span class="users">
                  <b class="bold-text">${from}</b> reservadamente para 
                  <b class="bold-text">${to}</b>:
                </span>
                <span class="text"> ${text}</span>
              </span>
            </li>
          `;
        }
        break;
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

  promise.then((response) => {
    scrollMessages();
    console.log(response.status);
  });
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
