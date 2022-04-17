const participantsUrl = "https://mock-api.driven.com.br/api/v6/uol/participants";
const messagesUrl = "https://mock-api.driven.com.br/api/v6/uol/messages";
let click;
let nameUser;
let messages = [];

function login (){
    nameUser = document.querySelector(".user-input").value;
    
    let promise = axios.post(participantsUrl, {name: nameUser});
    
    promise.then(userAllowed);
    promise.catch(showErrors);
    
    console.log(nameUser);
    console.log(promise);
}

function userAllowed(){
    document.querySelector(".login-screen").classList.add("hidden");
}

function showErrors(erro){ 
    let errorValue = erro.response.status;
    console.log("Status code: " + errorValue);
    
    if(nameUser === "" && errorValue == 400){
        alert(`Erro ${errorValue}! Campo em branco, digite seu usuário`);
    }
    else if (errorValue == 400){
        alert(`Erro ${errorValue}! Este usuário já existe, digite seu usuário novamente`);
    }
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