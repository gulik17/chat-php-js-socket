function message(text) {
    document.getElementById("chat-result").innerHTML += "<div>" + text + "</div>";
}

document.addEventListener("DOMContentLoaded", function() {
    const HOST = "chat.loc";
    const PORT = "8090";
    var socket = new WebSocket("ws://"+HOST+":"+PORT+"/server.php");

    socket.onopen = function() {
        message("Connection success");
    }

    socket.onerror = function(error) {
        message("Connection error: " + (error.message ? error.message : ""));
    }

    socket.onclose = function() {
        message("Connection closed");
    }

    socket.onmessage = function(event) {
        var data = JSON.parse(event.data);
        message(data.type + " — " + data.message);
    }
});

