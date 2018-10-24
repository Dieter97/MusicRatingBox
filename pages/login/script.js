var username = null;
var clientId = null;



function loginUser(){
    //Save username
    username = $('#username-input')[0].value;
    clientId = 'cli1entId_' + Math.random().toString(16).substr(2, 8);
    localStorage.setItem("username",username);
    localStorage.setItem("clientId",clientId);
    console.log('User now logged in\nUsername: '+username+'\nClientId: '+clientId);
    window.location = "../voter/voter.html";
    return false;
}

$( document ).ready(function() {
    var btnAdd = document.getElementById("installBtn");

    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('../../sw.js').then(function(registration) {
                // Registration was successful
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            }, function(err) {
                // registration failed :(
                console.log('ServiceWorker registration failed: ', err);
            });
        });
    }

    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault();
        // Stash the event so it can be triggered later.
        deferredPrompt = e;
        // Update UI notify the user they can add to home screen
        document.getElementById("installBtn").display = 'block';
    });

    document.getElementById("installBtn").addEventListener('click', (e) => {
        // hide our user interface that shows our A2HS button
        btnAdd.style.display = 'none';
        // Show the prompt
        deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        deferredPrompt.userChoice
            .then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the A2HS prompt');
                } else {
                    console.log('User dismissed the A2HS prompt');
                }
                deferredPrompt = null;
            });
    });
});



