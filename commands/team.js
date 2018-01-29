const errorMessage = 'Something went terribly wrong. Please come back later.';
const teams = ['Instinct', 'Mystic', 'Valor'];

const badPromise = new Promise((resolve, reject) => {
  resolve(errorMessage);
});

const assignTeam = (msg, team) => {
  if (!team) {
    return badPromise;
  }

  let roles = msg.channel.guild.roles;
  let member = msg.member;

  let role = roles.find(f => f.name === team);

  if (role) {
    return member
      .addRole(role.id)
      .then(() => {
        let name = member.nick || member.username;
        if (team !== 'Sponsored') {
          return `Everybody welcome our newest Team ${team} member, ${name}!`;
        } else {
          return `Added to the sponsored @ tag!`;
        }
      })
      .catch(e => {
        console.log('assignTeam', team, e);
        return errorMessage;
      });
  } else {
    return badPromise;
  }
};

const run = (client, message, args) => {
  const teamAliases = ['instinct', 'yellow', 'mystic', 'blue', 'valor', 'red'];
  let team;
  let response = 'I have no idea what team that is.';

  const choice = args[0].toLowerCase();
  if (teamAliases.indexOf(choice) === -1) {
    return message.channel.send(response).catch(console.error);
  }

  switch (choice) {
    case teamAliases[0]:
    case teamAliases[1]:
      team = teams[0];
      break;
    case teamAliases[2]:
    case teamAliases[3]:
      team = teams[1];
      break;
    case teamAliases[4]:
    case teamAliases[5]:
      team = teams[2];
      break;
  }

  assignTeam(message, team).then(result => {
    message.channel.send(result).catch(console.error);
  });
};

exports.teams = teams;
exports.assignTeam = assignTeam;
exports.run = run;
