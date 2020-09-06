<?php

class Chat
{
    public function sendHeaders($headersText, $newSocket, $host, $port) {
        $header = [];
        $tmpLine = preg_split("/\r\n/", $headersText);

        foreach($tmpLine as $line) {
            $line = rtrim($line);
            if (preg_match("/\A(\S+): (.*)\z/", $line, $matches)) {
                $headers[$matches[1]] = $matches[2];
            }
        }

        $key = $headers["Sec-WebSocket-Key"];
        $sKey = base64_encode(SHA1($key."258EAFA5-E914-47DA-95CA-C5AB0DC85B11", true));

        $strHeadr = "HTTP/1.1 101 Switching Protocols \r\n" .
            "Upgrade: websocket\r\n" .
            "Connection: Upgrade\r\n" .
            "WebSocket-Origin: $host\r\n" .
            "WebSocket-Location: ws://$host:$port/server.php\r\n" .
            "Sec-WebSocket-Accept: $sKey\r\n\r\n";

        socket_write($newSocket, $strHeadr, strlen($strHeadr));
    }

    public function newConnectionACK($client_ip_address) {
        $message = "New client " . $client_ip_address . " connected";
        $messageArray = [
            "message" => $message,
            "type" => "newConnectionACK",
        ];
        return $this->seal(json_encode($messageArray));
    }

    public function seal($socketData) {
        $length = strlen($socketData);
        $header = "";
        if ($length <= 125) {
            $header = pack("CC", 0x81, $length);
        } elseif ($length > 125 && $length < 65536) {
            $header = pack("CCn", 0x81, 126, $length);
        } elseif ($length > 65536) {
            $header = pack("CCNN", 0x81, 127, $length);
        }
        return $header.$socketData;
    }

    public function send($message, $clientSocketArray) {
        foreach($clientSocketArray as $clientSocket) {
            @socket_write($clientSocket, $message, strlen($message));
        }

        return true;
    }
}