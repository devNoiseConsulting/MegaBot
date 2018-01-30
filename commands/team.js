const errorMessage = 'Something went terribly wrong. Please come back later.';
const teams = ['Instinct', 'Mystic', 'Valor'];

const badPromise = new Promise((resolve, reject) => {
  resolve(errorMessage);
});

const assignTeam = (msg, team) => {
  if (!team) {
    return badPromise;
  }

  const roles = msg.channel.guild.roles;
  const member = msg.member;

  const role = roles.find(f => f.name === team);

  const removeTeams = roles.filter(role => role.name !== team && (teams.indexOf(role.name) !== -1));
  member.removeRoles(removeTeams);

  if (role) {
    return member
      .addRole(role.id)
      .then(() => {
        const name = member.nickname || member.user.username;
        return `Everybody welcome our newest Team ${team} member, ${name}!`;
      })
      .catch(e => {
        console.log('assignTeam', e);
        return errorMessage;
      });
  } else {
    return badPromise;
  }
};

const run = (message, args) => {
  const teamAliases = ['instinct', 'yellow', 'mystic', 'blue', 'valor', 'red'];
  let team;
  const response = 'I have no idea what team that is.';

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
    return message.channel.send(result).catch(console.error);
  });
};

module.exports = {
  name: 'team',
  description: 'Teams!',
  args: true,
  teams: teams,
  assignTeam: assignTeam,
  execute: run
};
