const THREE_SECONDS = 3000;
const FIVE_SECONDS = 5000;
const TEN_SECONDS = 10000;
const BASE_API_URL = "https://mock-api.driven.com.br/api/v6/uol";

let userName;
let recipient = "Todos";
let type = "message";
let visability = "Público";

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
  getListOfParticipants();
  showsTheRecipient();

  setInterval(getMessages, THREE_SECONDS);
  setInterval(keepConnected, FIVE_SECONDS);
  setInterval(getListOfParticipants, TEN_SECONDS);
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
  const body = {
    from: userName,
    to: recipient,
    text: userMessage,
    type: type,
  };

  let promise = axios.post(`${BASE_API_URL}/messages`, body);

  promise.then((res) => {
    scrollMessages();
    const { status, statusText } = res;
    console.info(
      `%c${status}, ${statusText} - Mensagem enviada`,
      "color: yellow; font-weight: bold; font-size: 15px; line-height: 25px;"
    );
    document.querySelector(".send-message-input").value = "";
  });
  promise.catch((err) => {
    const { status, data } = err.response;
    alert(`${data} Erro ${status} - Problema ao enviar sua mensagem`);
    window.location.reload();
  });
}

function sidebarOn() {
  let click = document.querySelector(".sidebar");
  if (!!click) click.classList.remove("hidden");
}

function sidebarOff() {
  document.querySelector(".sidebar").classList.add("hidden");
}

function getListOfParticipants() {
  const promise = axios.get(`${BASE_API_URL}/participants`);

  promise.then((res) => {
    renderParticipants(res.data);
  });
  promise.catch((err) => {
    const { status, data } = err.response;
    alert(
      `${data} Erro ${status} - Problema ao carregar os paticipantes do chat`
    );
    window.location.reload();
  });
}

function renderParticipants(participants) {
  let divParticipants = document.querySelector(".select-contacts");
  divParticipants.innerHTML = `
    <li class="users-contacts" onclick="selectRecipient(this)">
      <div class="selection-container">
        <ion-icon class="contact-icon" name="people"></ion-icon>
        <h5 class="to">Todos</h5>
      </div>
    </li>
  `;

  participants.forEach((participant) => {
    divParticipants.innerHTML += `
      <li class="users-contacts" onclick="selectRecipient(this)">
        <div class="selection-container">
          <ion-icon class="contact-icon" name="person-circle"></ion-icon>
          <h5 class="to">${participant.name}</h5>
        </div>
      </li>
    `;
  });
}

function selectRecipient(divParticipant) {
  recipient = divParticipant.querySelector(".to").innerHTML;

  const previousClick = document.querySelector(".users-contacts .selected");

  if (!!previousClick) previousClick.remove();

  divParticipant.innerHTML +=
    "<ion-icon class='selected' name='checkmark-outline'></ion-icon>";

  showsTheRecipient();
}

function selectVisibility(divVisibility) {
  visability = divVisibility.querySelector(".to").innerHTML;
  const previousClick = document.querySelector(".select-visibility .selected");

  if (visability === "Reservadamente") type = "private_message";
  if (!!previousClick) previousClick.remove();

  divVisibility.innerHTML +=
    "<ion-icon class='selected' name='checkmark-outline'></ion-icon>";

  showsTheRecipient();
}

function showsTheRecipient() {
  let divFooterRecipient = document.querySelector(".send-message-container");
  divFooterRecipient.innerHTML = "";

  divFooterRecipient.innerHTML += `
    <input class="send-message-input" placeholder="Escreva aqui..." />
    <div class="send-message-to">Enviando para ${recipient} (${visability})</div>
  `;
}
