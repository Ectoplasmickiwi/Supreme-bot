const Base = require('../base/Command');

const Discord = require('discord.js');

class Reload extends Base {
  constructor (client) {
    super(client, {
      name: 'reload',
      description: 'Reload the config.',
      usage: 'reload',
      aliases: ['rl']
    });
  }

  run (message) {
    const embed = new Discord.RichEmbed()
      .setAuthor(message.guild.name)
      .setColor(0xff0000);
    this.client.reload();
    message.channel.send(embed.setDescription('Reloaded the config!'));
  }
}

module.exports = Reload;
