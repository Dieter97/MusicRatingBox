//Global variables
var clientId;
var username;

$( document ).ready(function() {
    username = localStorage.getItem("username");
    clientId = localStorage.getItem("clientId");
    //Fill sidebar fields on load
    document.getElementById("username").innerText = username;
    document.getElementById("clientId-debug").innerHTML = clientId;
});
