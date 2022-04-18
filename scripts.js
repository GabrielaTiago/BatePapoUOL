const participantsUrl = "https://mock-api.driven.com.br/api/v6/uol/participants";
const messagesUrl = "https://mock-api.driven.com.br/api/v6/uol/messages";

let nameUser;

getMessages();

function login(){
    nameUser = document.querySelector(".user-input").value;
    
    let promise = axios.post(participantsUrl, {name: nameUser});
    
    promise.then(userAllowed);
    promise.catch(showErrors);
    
    console.log(nameUser);
    console.log(promise);
}

function userAllowed(){
    document.querySelector(".login-screen").classList.add("hidden");
    reloadMessages();
}

function showErrors(erro){ 
    let errorValue = erro.response.status;
    
    if(nameUser === "" && errorValue == 400) alert(`Erro ${errorValue}! Campo em branco, digite seu usuário`);
    else if (errorValue == 400) alert(`Erro ${errorValue}! Este usuário já existe, digite seu usuário novamente`);
}

function reloadMessages(){
    setInterval(getMessages, 3000);
    setInterval(keepConected, 5000);
}

function keepConected(){
    axios.post("https://mock-api.driven.com.br/api/v6/uol/status", {name: nameUser})
}

function getMessages(){
    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    promise.then(function(response){

        let divMessages = document.querySelector(".container-messages");
        divMessages.innerHTML = "";

        for(let i=0; i < response.data.length; i++){
            switch(response.data[i].type){
                case "status":
                    divMessages.innerHTML += `
                    <div class="status-message">
                        <div class="display-message">
                            <p><span class="time">(${response.data[i].time})</span>
                            <span><strong>${response.data[i].from}</strong> ${response.data[i].text}</span></p>
                        </div>
                    </div>`;
                    break;

                case "message":
                    divMessages.innerHTML += `
                    <div class="comum-message">
                        <div class="display-message">
                            <p><span class="time">(${response.data[i].time})</span>
                            <span><strong>${response.data[i].from}</strong> para <strong>${response.data[i].to}</strong>: ${response.data[i].text}</span></p>
                        </div>
                    </div>`;
                    break;

                case "private_message":
                    divMessages.innerHTML += `
                    <div class="private-message">
                        <div class="display-message">
                            <span class="time">(${response.data[i].time})</span>
                            <span><p><strong>${response.data[i].from}</strong> reservadamente para <strong>${response.data[i].to}</strong>: ${response.data[i].text}</p></span>
                        </div>
                    </div>`;
                    break;
            }
        }
    });
    reloadMessages()
}

function sidebarOn(){
    click = document.querySelector(".sidebar");
    if(click !== null){
        click.classList.remove("hidden");
    }   
}

function sidebarOff(){
    document.querySelector(".sidebar").classList.add("hidden");
}