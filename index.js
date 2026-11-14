const mineflayer = require('mineflayer');
const express = require('express');

// 1. Mini webpage so Render and UptimeRobot stay awake 24/7
const app = express();
app.get('/', (req, res) => res.send('TechnoBlade bot is running 24/7!'));
app.listen(process.env.PORT || 3000);

// 2. Your exact MCServerHost Primary details
const botArgs = {
  host: '51.79.229.238',
  port: 11249,
  username: 'TechnoBlade',
  auth: 'offline',
  version: false
};

let retryTimer = null;
let jumpTimer = null;

function keepTryingToConnect() {
  if (retryTimer) return; // Prevents double timers
  console.log('Not inside server. Trying again in 10 seconds...');
  retryTimer = setTimeout(() => {
    retryTimer = null;
    startBot();
  }, 10000);
}

function startBot() {
  // Clear any old jump timer before starting fresh
  if (jumpTimer) {
    clearInterval(jumpTimer);
    jumpTimer = null;
  }

  console.log('Attempting to join server as TechnoBlade...');
  const bot = mineflayer.createBot(botArgs);

  bot.on('spawn', () => {
    console.log('SUCCESS: TechnoBlade is inside the server!');
    // Jump every 30 seconds so MCServerHost sees active movement
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
}

// Start the infinite connection loop immediately
startBot();
