const { assignTeam, teams } = require('./team');

module.exports = {
  name: teams[2].toLowerCase(),
  description: `${teams[2]}!`,
  args: false,
  execute(message, args) {
    assignTeam(message, teams[2]).then(result => {
      message.channel.send(result).catch(console.error);
    });
  }
};
