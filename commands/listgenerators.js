const Base = require('../base/Command');

const Discord = require('discord.js');

class ListGenerators extends Base {
  constructor (client) {
    super(client, {
      name: 'listgenerators',
      description: 'Lists the generators.',
      usage: 'listgenerators',
      aliases: ['listgens', 'listgen', 'gens', 'generators', 'genlist', 'generatorslist', 'genslist'],
      permission: 'ADMINISTRATOR'
    });
  }

  run (message, args) {
    const embed = new Discord.RichEmbed()
      .setAuthor(message.guild.name)
      .setDescription('All generators')
      .setFooter(`${this.client.config.prefix}setup to add all the generators that are not in the database!`)
      .setColor(0xff0000);
    this.client.reload();

    this.client.config.generators.forEach((gen, i) => {
      this.client.db.query(`SELECT EXISTS(SELECT * FROM information_schema.tables WHERE table_schema = "${this.client.config.database.database}" AND table_name = "${gen}");`, result => {
        if (result[0][Object.keys(result[0])[0]] === 1) {
          embed.addField(gen, '\\✅ In database!', true);
        } else {
          embed.addField(gen, '\\❌ Not in database!', true);
        }
        if (i > 25) {
          message.channel.send(embed);
          embed.fields = [];
          i = 0;
        }
        if (i === this.client.config.generators.length - 1) {
          message.channel.send(embed);
        }
      });
    });
  }
}

module.exports = ListGenerators;
