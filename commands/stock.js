const Base = require('../base/Command');

const Discord = require('discord.js');

class Stock extends Base {
  constructor (client) {
    super(client, {
      name: 'stock',
      description: 'Shows the stock of the generators.',
      usage: 'stock'
    });
  }

  run (message, args) {
    const embed = new Discord.RichEmbed()
      .setAuthor(message.guild.name)
      .setDescription('All generators')
      .setFooter(`${this.client.config.prefix}setup to add all the generators that are not in the database!`)
      .setColor(0xff0000);
    this.client.reload();
    var i = 0;
    this.client.config.generators.forEach((gen) => {
      this.client.db.query(`SELECT EXISTS(SELECT * FROM information_schema.tables WHERE table_schema = "${this.client.config.database.database}" AND table_name = "${gen}");`, result => {
        if (result[0][Object.keys(result[0])[0]] === 1) {
          this.client.db.query(`SELECT COUNT(*) FROM \`${gen}\`;`, result => {
            if (result[0][Object.keys(result[0])[0]] > 0) {
              embed.addField(gen, `\\✅ ${result[0][Object.keys(result[0])[0]]} alts!`, true);
            } else {
              embed.addField(gen, '\\❌ No stock!', true);
            }
            i++;
            if (i > 25) {
              message.channel.send(embed);
              embed.fields = [];
              i = 0;
            }
            if (i === this.client.config.generators.length) {
              message.channel.send(embed);
            }
          });
        } else {
          embed.addField(gen, '\\❌ Not in database!', true);
        }
      });
    });
  }
}

module.exports = Stock;
