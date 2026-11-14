const mineflayer = require('mineflayer');
const express = require('express');

const app = express();
app.get('/', (req, res) => res.send('TechnoBlade bot is running 24/7!'));
app.listen(process.env.PORT || 3000);

const botArgs = {
  host: '51.79.229.238',
  port: 11249,
  username: 'TechnoBlade',
  auth: 'offline',
  version: '1.21.4' // Changed from false to '1.21.4' so ViaBackwards lets it join!
  skipPing: true
};

let retryTimer = null;
let jumpTimer = null;

function keepTryingToConnect() {
  if (retryTimer) return;
  console.log('Not inside server. Trying again in 10 seconds...');
  retryTimer = setTimeout(() => {
    retryTimer = null;
    startBot();
  }, 10000);
}

function startBot() {
  if (jumpTimer) {
    clearInterval(jumpTimer);
    jumpTimer = null;
  }

  console.log('Attempting to join server as TechnoBlade (1.21.4)...');

  try {
    const bot = mineflayer.createBot(botArgs);

    bot.on('spawn', () => {
      console.log('SUCCESS: TechnoBlade is inside the server!');
      jumpTimer = setInterval(() => {
        bot.setControlState('jump', true);
        setTimeout(() => bot.setControlState('jump', false), 500);
      }, 30000);
    });

    bot.on('kicked', (reason) => {
      console.log('Kicked from server:', reason);
      keepTryingToConnect();
    });

    bot.on('error', (err) => {
      console.log('Connection error:', err.message);
      keepTryingToConnect();
    });

    bot.on('end', () => {
      console.log('Disconnected from server.');
      keepTryingToConnect();
    });
  } catch (err) {
    console.log('Bot startup error:', err.message);
    keepTryingToConnect();
  }
}

startBot();
