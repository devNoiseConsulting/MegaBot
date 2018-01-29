const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const fs = require('fs');

client.on("ready", () => {
  console.log("I am ready!");
});

/*
Command: !nest waterworks park voltorb
Output: Waterworks Park: Voltorb

Command: !nest [location] [pokemon]
(Input should be lowercase and spaces only)
Output: [Location]: [Pokemon]
(Output should be first letter of word(s) capitalized separated by colon space and first letter of word(s) capitalized
We lose the ability to sort A-Z in the actual output list but who cares our local list is never going to be very large
*/

client.on("message", (message) => {
  // Exit and stop if the prefix is not there or if user is a bot
  if (!message.content.startsWith(config.prefix) || message.author.bot) return;

  // This is the best way to define args. Trust me.
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase().replace(/[^\w-]/, '');

  // The list of if/else is replaced with those simple 2 lines:
  try {
    commandFilePath = `./commands/${command}.js`;
    if (fs.existsSync(commandFilePath)) {
      let commandFile = require(commandFilePath);
      commandFile.run(client, message, args);
    }
  } catch (err) {
    console.error(err);
  }
});

client.login(config.token);
