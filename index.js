// Deps
const Discord = require("discord.js");
let process = require('process');
process.env = { token: '' }; // Add token or use your preferd .env library

// Catch errors
process.on('uncaughtException', function(err) {
  console.log(err);
});

// Make client
let trans = {};
trans.client = new Discord.Client({
  intents: [
    Object.values(Discord.Intents.FLAGS).reduce((acc, p) => acc | p, 0)
  ],
  partials: [
    "REACTION",
    "CHANNEL"
  ]
});
trans.client.on('ready', () => {
  console.log(trans.client.user.tag + " is alive!")
})
/* Run this to regiester the context commands (only once):
trans.client.application.commands.create({
  name: 'translate',
  type: 3
})
trans.client.application.commands.create({
  name: 'translate for all',
  type: 3
})
*/

// Main loop
(async() => {
  // Login
  await trans.client.login(process.env['token'])

  // Listen to interactions (extra logic should be added if additional interactions exist)
  trans.client.on('interactionCreate', async (interaction) => {
    // Translate
    let s = await fetch('https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&dj=1&source=input&q=' + encodeURIComponent(interaction.options.getMessage('message').content));
    s = await s.json();
    // Send
    await interaction.reply({
      content: s.sentences[0].trans,
      ephemeral: (interaction.commandName === 'translate')
    })
  });
})();
