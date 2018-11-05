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
    //document.getElementById("clientId-debug").innerHTML = clientId;

    connect();
});

function connect(){
    document.getElementById("connecting-overlay").classList.remove("hidden");
    //Start and check connection with MQTT borker
    // Create a client instance
    client = new Paho.MQTT.Client('club-iot.tk', 8083, clientId); // Live: club-iot.tk:8083  Test: iot.eclipse.org:443

    // set callback handlers
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;

    client.connect({onSuccess:onConnect,onFailure: onFailure,userName: 'club_app' ,password: 'xn5hb3zu',useSSL : true});

}

function onFailure(invocationContext){
    console.log("Error connection:\nCode="+invocationContext.errorCode+"\nMessage="+invocationContext.errorMessage);
    $("#errorModal").modal("show"); //Show error message
    //Try again
    setTimeout(function () {
        connect();
    }, 5000);

}

// called when the client connects
function onConnect() {
    // Once a connection has been made, make a subscription and send a message.
    console.log("Connected, subscribing to music topic...");
    client.subscribe("music");
    document.getElementById("connecting-overlay").classList.add("hidden");
    $("#errorModal").modal("hide");
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:"+responseObject.errorMessage);
        $("#errorModal").modal("show");
        //Reconnect
        setTimeout(function () {
            connect();
        }, 5000);
    }
}

function sendVote(value){
    if(username === null || clientId === null || currentSong === null){
        alert('Voting is not possible at the moment!');
        return;
    }
    if(client === null){
        alert("Not connected!");
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
    console.log('Vote send: '+JSON.stringify(vote));
    //Show voted screen
    document.getElementById("voted-overlay").classList.remove("hidden");
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
            if(musicObject.year !== 0 || musicObject.year !== '0'){
                document.getElementById("song-year-view").innerText = musicObject.year;
            }else{
                document.getElementById("song-year-view").innerText = "";
            }
            //Find album art
            albumArt( musicObject.artist, {album: musicObject.title, size: 'large'},(error, link) =>{
                console.log(link);
                //check if the result is a valid url
                if(typeof link === 'string'){
                    document.getElementById('album-art-view').setAttribute('src',link);
                }else{
                    document.getElementById('album-art-view').setAttribute('src','../../img/icon2-512.png');
                }
            });

            currentSong = musicObject;

            //Show voted screen
            document.getElementById("voted-overlay").classList.add("hidden");
        }catch(e){
            console.log("Error parsing music data: "+e.stack);
        }
    }
}
