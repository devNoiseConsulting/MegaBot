const capitalized = string => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

const clearNestMessages = message => {
  let nestListChannel = message.guild.channels.find('name', 'nest-list');
  nestListChannel.fetchMessages().then(messages => {
    messages = messages.filter(msg => !msg.pinned);
    nestListChannel.bulkDelete(messages).catch(console.error);
  });
};

const postNests = (message, Nests) => {
  let nestListChannel = message.guild.channels.find('name', 'nest-list');

  Nests.findAll({
    order: [['location'], ['reported_on', 'DESC']]
  }).then(async results => {
    results = results.reduce((acc, v) => {
      if (acc.has(v.location)) {
        let park = acc.get(v.location);
        park.push(v.pokemon);
        acc.set(v.location, park);
      } else {
        acc.set(v.location, [v.pokemon]);
      }
      return acc;
    }, new Map());
    let parks = Array.from(results.keys()).map(park => {
        let pokemon = results
          .get(park)
          .filter((mon, i, arr) => arr.indexOf(mon) == i)
          .join(', ');
        return `${park} - ${pokemon}`;
      })
      .join('\n');
    await clearNestMessages(message);
    nestListChannel.send(parks).catch(console.error);
  });
};

const insertNest = (message, args, Nests) => {
  let [pokemon, ...location] = args.reverse();
  pokemon = capitalized(pokemon).replace(/[^\w ]+/g, ' ');
  location = location
    .reverse()
    .map(word => capitalized(word))
    .join(' ')
    .replace(/[^\w ',\.]+/g, ' ');

  const member = message.member;
  const user = `${member.nickname || member.user.username} -X- ${member.id}`;

  try {
    Nests.create({
      location: location,
      pokemon: pokemon,
      reported_by: user,
      reported_on: new Date()
    }).then(async nest => {
      await postNests(message, Nests);
      return message.reply(`Nest for ${nest.location} added.`);
    });
  } catch (e) {
    console.log('insertNest', e);
    return message.reply('Something went wrong with adding the nest.');
  }
};

const clearNest = (message, args, Nests) => {
  const location = args
    .slice(1)
    .map(word => capitalized(word))
    .join(' ')
    .replace(/[^\w ',\.]+/g, ' ');
  Nests.destroy({
    where: {
      location: location
    }
  })
    .then(async affectedRows => {
      await postNests(message, Nests);
      return message.reply(`Removed ${affectedRows} reports for ${location}.`);
    })
    .catch(error => {
      console.error(error);
      return message.reply('Something went wrong with removing the nests.');
    });
};

const nukeNests = (message, args, Nests) => {
  clearNestMessages(message);

  Nests.destroy({
    where: {},
    truncate: true
  })
    .then(affectedRows => {
      return message.reply(`${affectedRows} nests were removed.`);
    })
    .catch(error => {
      console.error(error);
      return message.reply('Something went wrong with removing the nests.');
    });
};

const subCommandRouter = (message, args, Nests) => {
  switch (args[0]) {
    case 'clear':
      return clearNest(message, args, Nests);
      break;
    case 'nuke':
      return nukeNests(message, args, Nests);
      break;
    case 'help':
      return message.reply(
        'Something should be here to help you use this command.'
      );
      break;
    default:
      return insertNest(message, args, Nests);
  }
};

module.exports = {
  name: 'nest',
  description: 'Nest!',
  args: true,
  execute: subCommandRouter
};
