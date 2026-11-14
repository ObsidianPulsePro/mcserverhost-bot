const mineflayer = require('mineflayer');
const express = require('express');

const app = express();
app.get('/', (req, res) => res.send('Bot is awake!'));
app.listen(process.env.PORT || 3000);

const botArgs = {
  host: 'dholakpurpro.mcsh.gg',   // ONLY the address (Example: 'myserver.mcsh.io')
  port: 25565,              // ONLY the port number here (no quotes!)
  username: 'AFK_Guardian',
  auth: 'offline',
  version: false
};

let reconnecting = false;

function scheduleReconnect() {
  if (reconnecting) return;
  reconnecting = true;
  console.log('Rejoining in 10 seconds...');
  setTimeout(() => {
    reconnecting = false;
    startBot();
  }, 10000);
}

function startBot() {
  console.log('Trying to connect to server...');
  const bot = mineflayer.createBot(botArgs);

  bot.on('spawn', () => {
    console.log('Bot joined the server!');
    setInterval(() => {
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 500);
    }, 30000);
  });

  bot.on('kicked', (reason) => {
    console.log('Kicked by server:', reason);
    scheduleReconnect();
  });

  bot.on('error', (err) => {
    console.log('Connection error:', err.message);
    scheduleReconnect();
  });

  bot.on('end', () => {
    console.log('Disconnected.');
    scheduleReconnect();
  });
}

startBot();
