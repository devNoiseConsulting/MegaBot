const capitalized = string => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

const insertNest = (message, args, sequelize, Nests) => {
  let [pokemon, ...location] = args.reverse();
  pokemon = capitalized(pokemon).replace(/[^\w ]+/g, ' ');
  location = location
    .reverse()
    .map(word => capitalized(word))
    .join(' ')
    .replace(/[^\w ]+/g, ' ');

  const member = message.member;
  const user = `${member.nickname || member.user.username} -X- ${member.id}`;

  try {
    Nests.create({
      location: location,
      pokemon: pokemon,
      reported_by: user,
      reported_on: new Date()
    }).then(nest => {
      Nests.findAll({
        order: [['location'], ['reported_on', 'DESC']]
      }).then(results => {
        results = results
          .map(result => `${result.location} - ${result.pokemon}`)
          .join('\n');
        let nestListChannel = message.guild.channels.find('name', 'nest-list');
        nestListChannel.fetchMessages().then(messages => {
          messages = messages.filter(msg => !msg.pinned);
          nestListChannel.bulkDelete(messages).catch(console.error);
          nestListChannel.send(results).catch(console.error);
        });
      });
      return message.reply(`Nest for ${nest.location} added.`);
    });
  } catch (e) {
    console.log('insertNest', e);
    return message.reply('Something went wrong with adding the nest.');
  }
};

module.exports = {
  name: 'nest',
  description: 'Nest!',
  args: false,
  execute: insertNest
};
