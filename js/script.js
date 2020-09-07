function message(text) {
    document.getElementById("chat-result").innerHTML += "<div><div class='msg'>" + text + "</div></div>";
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
        let data = JSON.parse(event.data);
        if (data.type == "chat-box") {
            message(data.message);
        } else {
            message(data.type + " — " + data.message);
        }
    }

    chat_btn.onclick = function(evt) {
        evt.preventDefault();
        let usr = document.getElementById("chat_user").value;
        let msg = document.getElementById("chat_message").value;

        if (!usr) {
            alert("Укажите ваше имя");
            return false;
        }
        if (!msg) {
            alert("Введите сообщение");
            return false;
        }

        let message = {
            chat_user: usr,
            chat_message: msg,
        };
        document.getElementById("chat_user").setAttribute("disabled", "disabled");
        document.getElementById("chat_message").value = "";
        socket.send(JSON.stringify(message));
    }
});
