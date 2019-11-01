const Base = require('../base/Command');

const Discord = require('discord.js');

class ResetCooldown extends Base {
  constructor (client) {
    super(client, {
      name: 'resetcooldown',
      description: 'Resets a cooldown of a user.',
      usage: 'resetcooldown <user>',
      args: 1,
      aliases: ['removecooldown', 'remcooldown', 'cooldownreset'],
	  permission: 'ADMINISTRATOR'
    });
  }

  run (message, args) {
    const embed = new Discord.RichEmbed()
      .setAuthor(message.guild.name)
      .setColor(0xff0000);
    const user = message.mentions.users.first() || this.client.users.find(user => user.username === args[0] || user.id === args[0]);
    const cooldown = this.client.commands.find(x => x.help.name === 'generate').usercooldown.find(x => x.user === user.id);
    if (!user) {
      return message.channel.send(embed.setDescription('I can\'t find that user'));
    }
    if (!cooldown) {
      return message.channel.send(embed.setDescription(`${user} is not in cooldown!`));
    } else {
      this.client.commands.find(x => x.help.name === 'generate').usercooldown.splice(this.client.commands.find(x => x.help.name === 'generate').usercooldown.findIndex(x => x.user === user.id), 1);
      message.channel.send(embed.setDescription(`${user} is no longer in cooldown!`));
    }
  }
}

module.exports = ResetCooldown;
