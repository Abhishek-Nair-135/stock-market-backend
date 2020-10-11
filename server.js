const express = require("express");
const socket = require("socket.io");
const app = express();
const WebSocket = require("ws");
const source = new WebSocket("wss://ws.finnhub.io?token=bu0plmf48v6v4d3lelog");

// Connection opened -> Subscribe
source.addEventListener("open", function (event) {
 /* source.send(JSON.stringify({ type: "subscribe", symbol: "BINANCE:BTCUSDT" })); */  //BINANCE:BTCUSDT
   /* source.send(JSON.stringify({ type: "subscribe", symbol: "BINANCE:BNBBTC" })); */
  source.send(JSON.stringify({ type: "subscribe", symbol: "OANDA:NATGAS_USD" }));
});

const server = app.listen(4000);
const io = socket(server);

io.on("connection", (socket) => {
    console.log("Connected....");
  // Listen for messages
  let interval;

  source.addEventListener("message", function (event) {
    if (interval) {
      clearInterval(interval);
    }
    interval = setInterval(
      () => {
          io.sockets.emit('stock', event.data);
          console.log('Message from server ', event.data);
      },
      2000
    );
    //console.log('Message from server ', event.data);
  });

  // Unsubscribe
  var unsubscribe = function (symbol) {
    source.send(JSON.stringify({ type: "unsubscribe", symbol: symbol }));
  };
});
