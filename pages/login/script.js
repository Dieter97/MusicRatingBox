var username = null;
var clientId = null;

function loginUser(){
    //Save username
    username = $('#username-input')[0].value;
    clientId = guid();//'clientId_' + Math.random().toString(16).substr(2, 8);
    localStorage.setItem("username",username);
    localStorage.setItem("clientId",clientId);
    console.log('User now logged in\nUsername: '+username+'\nClientId: '+clientId);
    window.location = "../voter/voter.html";
    return false;
}


