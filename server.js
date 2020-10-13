const express = require("express");
const sock = require("socket.io");
const app = express();
const WebSocket = require("ws");

const server = app.listen(4000);
const io = sock(server);

const one = io.of("/Binance_BNBBTC");
const two = io.of("/Binance_BTCUSDT");

//Connection for entity one
one.on("connection", (socket) => {
  const source = new WebSocket("wss://ws.finnhub.io?token=bu0plmf48v6v4d3lelog");
  // Connection opened -> Subscribe
  source.addEventListener("open", function (event) {
    //Alternate subscriptions if data of the current crypto is not available
    /* source.send(JSON.stringify({ type: "subscribe", symbol: "BINANCE:BTCUSDT" })); */ 
    /* source.send(JSON.stringify({ type: "subscribe", symbol: "BINANCE:BNBBTC" })); */
    source.send(
      JSON.stringify({ type: "subscribe", symbol: "BINANCE:BNBBTC" })
    );
  });

  console.log("Connected one....");
  // Listen for messages
  let interval;

  source.addEventListener("message", function (event) {
    if (interval) {
      clearInterval(interval);
    }
    interval = setInterval(() => {
      let temp = JSON.parse(event.data);
      if (temp.type === "trade") {
        one.emit("stock", event.data);
        console.log("Message from server ", temp.data);
        console.log("Date ", new Date(temp.data[0].t).toTimeString());
      }
    }, 5000);
  });
  socket.on('disconnect', () => {
    console.log("disconnected one...");
    source.send(JSON.stringify({ type: "unsubscribe", symbol: "BINANCE:BNBBTC" }));
    source.close();
  });
});


//Connection for entity two
two.on("connection", (socket) => {
  const source = new WebSocket("wss://ws.finnhub.io?token=bu0plmf48v6v4d3lelog");
  // Connection opened -> Subscribe
  source.addEventListener("open", function (event) {
    //Alternate subscriptions if data of the current crypto is not available
    /* source.send(JSON.stringify({ type: "subscribe", symbol: "BINANCE:BTCUSDT" })); */ //BINANCE:BTCUSDT
    /* source.send(JSON.stringify({ type: "subscribe", symbol: "BINANCE:BNBBTC" })); */
    source.send(
      JSON.stringify({ type: "subscribe", symbol: "BINANCE:BTCUSDT" })
    );
  });

  console.log("Connected two....");
  // Listen for messages
  let interval;

  source.addEventListener("message", function (event) {
    if (interval) {
      clearInterval(interval);
    }
    interval = setInterval(() => {
      let temp = JSON.parse(event.data);
      if (temp.type === "trade") {
        two.emit("stock", event.data);
        console.log("Message from server ", temp.data);
        console.log("Date ", new Date(temp.data[0].t).toTimeString());
      }
    }, 5000);
  });
  socket.on('disconnect', () => {
    console.log("disconnected two...");
    source.send(JSON.stringify({ type: "unsubscribe", symbol: "BINANCE:BNBBTC" }));
    source.close();
  });
});
