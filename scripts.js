const participantsUrl = "https://mock-api.driven.com.br/api/v6/uol/participants"; 
let click;
let nameUser;



function userNotExists(){
    document.querySelector(".login-screen").classList.add("hidden");
}

function login (){
    nameUser = document.querySelector(".user-input").value;

    let promise = axios.post(participantsUrl, {name: nameUser});
    
    console.log(nameUser);

    promise.then(userNotExists)
    //response.data

    promise.catch(error)

}

function error(error){
    console.log(error);
    // arlet de erro
    // tratar os erros verificando os status 
    // 400
    //error.response.status
}

/*if(!nameUser == ''){
        document.querySelector(".login-screen").classList.add("hidden");  
    }*/