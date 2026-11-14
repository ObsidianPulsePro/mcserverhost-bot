const mineflayer = require('mineflayer');
const express = require('express');

// 1. Mini website so the free cloud host stays awake
const app = express();
app.get('/', (req, res) => res.send('Bot is awake!'));
app.listen(process.env.PORT || 3000);

// 2. Your MCServerHost server details
const botArgs = {
  host: 'dholakpurpro.mcsh.gg',   // Example: 'myserver.mcsh.io'
  port: 25565,              // Put your port number here (no quotes!)
  username: 'AFK_Guardian', // Pick any name you want
  auth: 'offline'           // No official Minecraft account needed
};

function startBot() {
  const bot = mineflayer.createBot(botArgs);

  // Move slightly every 30 seconds so MCServerHost knows someone is active
  bot.on('spawn', () => {
    console.log('Bot joined the server!');
    setInterval(() => {
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 500);
    }, 30000);
  });

  // Rejoin automatically if disconnected
  bot.on('end', () => {
    console.log('Disconnected. Rejoining in 10 seconds...');
    setTimeout(startBot, 10000);
  });

  bot.on('error', (err) => console.log('Error:', err));
}

startBot();
