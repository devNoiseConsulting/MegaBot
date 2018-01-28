const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");

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

  if (message.content.startsWith(config.prefix + "ping")) {
    message.channel.send("pong!");
  } else
  if (message.content.startsWith(config.prefix + "foo")) {
    message.channel.send("bar!");
  }
});

client.login(config.token);
