const Base = require('../base/Command');

const Discord = require('discord.js');

class Setup extends Base {
  constructor (client) {
    super(client, {
      name: 'setup',
      description: 'Set up the system.',
      usage: 'setup',
      permission: 'ADMINISTRATOR'
    });
  }

  run (message, args) {
    const embed = new Discord.RichEmbed()
      .setAuthor(message.guild.name)
      .setColor(0xff0000);
    const loading = this.client.emojis.find(x => x.name === 'loading') || ':arrows_counterclockwise:';
    this.client.reload();
    message.channel.send(embed.setDescription(`${loading} Making tables...`)).then(msg => {
      var i = 0;
      this.client.config.generators.forEach((gen) => {
        this.client.db.query(`CREATE TABLE IF NOT EXISTS \`${gen}\` (alt TEXT);`, () => {
          i++;
          if (i === this.client.config.generators.length) {
            msg.edit(embed.setDescription(`${loading} Creating roles...`)).then(msg => {
              var i = 0;
              this.client.config.roles.forEach(role => {
                if (!message.guild.roles.some(x => x.name.toLowerCase() === role.name.toLowerCase()) && role.name.toLowerCase() !== 'default') {
                  message.guild.createRole(role).then(r => r.setColor(role.color));
                } else {
                  if (role.name !== 'default') {
                    message.guild.roles.find(x => x.name.toLowerCase() === role.name.toLowerCase()).setColor(role.color);
                  }
                }
                i++;
                if (i === this.client.config.roles.length) {
                  msg.edit(embed.setDescription('Setup done!'));
                }
              });
            });
          }
        });
      });
    });
  }
}

module.exports = Setup;
