// Deps
const Discord = require("discord.js");
let { translate } = require('@vitalets/google-translate-api');
const { getAgent } = require('./agent.js');
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
  type: 3,
  name: 'translate',
  integration_types: [0, 1],
  contexts: [0, 1, 2]
})
trans.client.application.commands.create({
  type: 3,
  name: 'translate for myself',
  integration_types: [0, 1],
  contexts: [0, 1, 2]
})
*/

// Main loop
(async() => {
  // Login
  await trans.client.login(process.env['token']);
  trans.client.on('ready', () => {
    console.log(trans.client.user.tag + " is alive!");
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
    let agent = await getAgent();
    let translation = await translate(msgContent, {
      to: 'en',
      fetchOptions: { agent }
    });
    // Send
    await interaction.reply({
      content: `${translation.text}
-# ⓘ Translated from ${new Intl.DisplayNames(['en'], {type: 'language'}).of(translation.raw.src)}`,
      flags: (interaction.commandName === 'translate') ? 0 : Discord.MessageFlags.Ephemeral
    });
  });
})();