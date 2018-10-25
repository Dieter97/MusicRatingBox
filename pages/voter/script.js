//Global variables
var clientId;
var username;

var currentSong = null;

//The mqqt client
var client;

$( document ).ready(function() {
    username = localStorage.getItem("username");
    clientId = localStorage.getItem("clientId");

    try{
        username.trim();
        clientId.trim();
    }catch(e){
        console.log("User not logged in!");
        window.location = '../login/login.html';
    }
    //Fill sidebar fields on load
    document.getElementById("username").innerText = username;
    document.getElementById("clientId-debug").innerHTML = clientId;

    connect();
});

function connect(){
    //Start and check connection with MQTT borker
    // Create a client instance
    client = new Paho.MQTT.Client('broker.mqttdashboard.com', 8000, clientId); //ws://143.129.39.126

    // set callback handlers
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;

    // connect the client
    client.connect({onSuccess:onConnect,userName: 'club_app' ,password: 'xn5hb3zu'});
}

// called when the client connects
function onConnect() {
    // Once a connection has been made, make a subscription and send a message.
    console.log("onConnect");
    client.subscribe("music");
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:"+responseObject.errorMessage);
    }
}

function sendVote(value){
    if(username === null || clientId === null || currentSong === null){
        alert('Voting is not possible at the moment!');
        return;
    }
    var event = new Date(); // Get current timestamp
    var vote = {"timestamp": event.toISOString(),
                "value": value,
                "username": username,
                "uid": clientId,
                "songid": currentSong.songid};
    message = new Paho.MQTT.Message(JSON.stringify(vote));
    message.destinationName = "votes"; //Send to votes topic
    message.qos= 1; //QoS type 1 : at least once
    client.send(message);
}

// called when a message arrives
// Handles the each specific message behaviour
function onMessageArrived(message) {
    if(message.destinationName === 'music'){
        //Music message update the info and remove the already voted overlay
        console.log("Music arrived:"+message.payloadString);
        try{
            var musicObject = JSON.parse(message.payloadString);
            document.getElementById("song-title-view").innerText = musicObject.title;
            document.getElementById("song-artist-view").innerText = musicObject.artist;
            currentSong = musicObject;
        }catch(e){
            console.log("Error parsing music data: "+e.stack);
        }

    }

}
