const Base = require('../base/Command');

const Discord = require('discord.js');

class CreateGenerator extends Base {
  constructor (client) {
    super(client, {
      name: 'creategenerator',
      description: 'Create a generator.',
      usage: 'creategenerator <name>',
      args: 1,
      aliases: ['gencreate', 'creategen', 'makegen', 'makegenerator', 'genmake', 'generatormake', 'addgen', 'addgenerator', 'generatoradd', 'genadd'],
      permission: 'ADMINISTRATOR'
    });
  }

  run (message, args) {
    const embed = new Discord.RichEmbed()
      .setAuthor(message.guild.name)
      .setColor(0xff0000);
    this.client.reload();
    if (this.client.config.generators.find(x => x.toLowerCase() === args.join(' ').toLowerCase())) {
      return message.channel.send(embed.setDescription('That generator already exists!'));
    }
    this.client.config.generators = [...this.client.config.generators, args.join(' ')];
    this.client.rewriteConfig();
    this.client.db.query(`CREATE TABLE IF NOT EXISTS \`${args.join(' ')}\` (alt TEXT);`, () => {
      message.channel.send(embed.setDescription(`Added ${args.join(' ')} as generator!`));
    });
  }
}

module.exports = CreateGenerator;
