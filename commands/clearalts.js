const Base = require('../base/Command');

const Discord = require('discord.js');

class ClearAlts extends Base {
  constructor (client) {
    super(client, {
      name: 'clearalts',
      description: 'Add alts from raw link.',
      usage: 'clearalts <alt type>',
      args: 1,
      permission: 'ADMINISTRATOR'
    });
  }

  run (message, args) {
    const embed = new Discord.RichEmbed()
      .setAuthor(message.guild.name)
      .setColor(0xff0000);
    this.client.reload();
    let type;
    if (this.client.config.generators.some(x => x.toLowerCase() === args.join(' ').toLowerCase())) {
      type = this.client.config.generators.find(x => x.toLowerCase() === args.join(' ').toLowerCase());
    } else {
      return message.channel.send(embed.setDescription('Sorry, i can\'t find that alt type! Alt types:\n' + this.client.config.generators.map(x => '- ' + x).join('\n')));
    }
    this.client.db.query(`TRUNCATE \`${type}\`;`, () => {
      message.channel.send(embed.setDescription(`Cleared all the ${type} alts!`));
    });
  }
}

module.exports = ClearAlts;
