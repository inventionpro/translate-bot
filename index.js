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
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.MessageContent
  ],
  partials: [
    Discord.Partials.Channel,
    Discord.Partials.Reaction
  ]
});
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
  await trans.client.login(process.env['token']);
  trans.client.on('ready', () => {
    console.log(trans.client.user.tag + " is alive!")
  });

  // Listen to interactions (extra logic should be added if additional interactions exist)
  trans.client.on('interactionCreate', async (interaction) => {
    let msgContent = interaction.options.getMessage('message').content;
    if (msgContent.length<1) {
      await interaction.reply({
        content: `Message does not have text`,
        flags: Discord.MessageFlags.Ephemeral
      });
      return;
    }
    // Translate
    let s = await fetch('https://api.fsh.plus/translate?lang=en&text='+encodeURIComponent(msgContent));
    s = await s.json();
    // Send
    await interaction.reply({
      content: `${s.text}
-# ⓘ Translated from ${new Intl.DisplayNames(['en'], {type: 'language'}).of(s.source)}`,
      flags: (interaction.commandName === 'translate') ? Discord.MessageFlags.Ephemeral : 0
    });
  });
})();