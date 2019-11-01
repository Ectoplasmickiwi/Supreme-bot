const Base = require('../base/Command');

const fetch = require('node-fetch');
const Discord = require('discord.js');

class AddAlts extends Base {
  constructor (client) {
    super(client, {
      name: 'addalts',
      description: 'Add alts from raw link.',
      usage: 'addalts <raw text link> <alt type>',
      args: 2,
      permission: 'ADMINISTRATOR'
    });
  }

  run (message, args) {
    const embed = new Discord.RichEmbed()
      .setAuthor(message.guild.name)
      .setColor(0xff0000);
    this.client.reload();
    const alts = args.shift();
    let type;
    if (this.client.config.generators.some(x => x.toLowerCase() === args.join(' ').toLowerCase())) {
      type = this.client.config.generators.find(x => x.toLowerCase() === args.join(' ').toLowerCase());
    } else {
      return message.channel.send(embed.setDescription('Sorry, i can\'t find that alt type! Alt types:\n' + this.client.config.generators.map(x => '- ' + x).join('\n')));
    }
    this.client.db.query(`SELECT EXISTS(SELECT * FROM information_schema.tables WHERE table_schema = "${this.client.config.database.database}" AND table_name = "${type}");`, result => {
      if (result[0][Object.keys(result[0])[0]] === 1) {
        const loading = this.client.emojis.find(x => x.name === 'loading') || ':arrows_counterclockwise:';
        message.channel.send(embed.setDescription(`${loading} Getting alts & putting in...`)).then(msg => {
          fetch(alts)
            .then(res => res.text())
            .then(accs => {
              const accounts = accs.replace(/\r/g, '').split('\n');
              var i = 0;
              accounts.forEach(acc => {
                this.client.db.query(`INSERT INTO \`${type}\`(\`alt\`) VALUES ("${acc}")`, () => {
                  i++;
                  if (i === accounts.length) {
                    msg.edit(embed.setDescription('Added the alts!'));
                  }
                });
              });
            });
        });
      } else {
        message.channel.send(embed.setDescription('That generator is not in the database! Use -setup to add it!'));
      }
    });
  }
}

module.exports = AddAlts;
