const Base = require('../base/Command');

const Discord = require('discord.js');

class RemoveGenerator extends Base {
  constructor (client) {
    super(client, {
      name: 'removegenerator',
      description: 'Delete a generator.',
      usage: 'removegenerator <name>',
      args: 1,
      aliases: ['genremove', 'removegen', 'delgen', 'gendelete', 'deletegen', 'deletegenerator', 'generatordelete'],
      permission: 'ADMINISTRATOR'
    });
  }

  run (message, args) {
    const embed = new Discord.RichEmbed()
      .setAuthor(message.guild.name)
      .setColor(0xff0000);
    const i = this.client.config.generators.findIndex(x => x.toLowerCase() === args.join(' ').toLowerCase());
    if (i < 0) {
      return message.channel.send(embed.setDescription('I can\'t find that generator!'));
    }
    this.client.db.query(`SELECT EXISTS(SELECT * FROM information_schema.tables WHERE table_schema = "${this.client.config.database.database}" AND table_name = "${args.join(' ')}");`, result => {
      if (result[0][Object.keys(result[0])[0]] === 1) {
        this.client.db.query(`DROP TABLE \`Account Generator\`.\`${args.join(' ')}\``, () => {
          this.client.config.generators.splice(i, 1);
          this.client.rewriteConfig();
          message.channel.send(embed.setDescription(`Removed ${args.join(' ')} as generator!`).setFooter('This generator has been removed from the database too!'));
        });
      } else {
        this.client.config.generators.splice(i, 1);
        this.client.rewriteConfig();
        this.client.reload();
        message.channel.send(embed.setDescription(`Removed ${args.join(' ')} as generator!`).setFooter('This generator was not found in the database.'));
      }
    });
  }
}

module.exports = RemoveGenerator;
