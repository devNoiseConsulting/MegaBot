const { assignTeam, teams } = require('./team');

exports.run = (client, message, args) => {
  assignTeam(message, teams[2]).then(result => {
    message.channel.send(result).catch(console.error);
  });
};
