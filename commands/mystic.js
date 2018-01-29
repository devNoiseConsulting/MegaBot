const { assignTeam, teams } = require('./team');

module.exports = {
  name: teams[1].toLowerCase(),
  description: `${teams[1]}!`,
  args: false,
  execute(message, args) {
    assignTeam(message, teams[1]).then(result => {
      message.channel.send(result).catch(console.error);
    });
  }
};
