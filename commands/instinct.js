const { assignTeam, teams } = require('./team');

module.exports = {
  name: teams[0].toLowerCase(),
  description: `${teams[0]}!`,
  args: false,
  execute(message, args) {
    assignTeam(message, teams[0]).then(result => {
      message.channel.send(result).catch(console.error);
    });
  }
};
