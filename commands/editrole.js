const Base = require('../base/Command');

const Discord = require('discord.js');

class EditRole extends Base {
  constructor (client) {
    super(client, {
      name: 'editrole',
      description: 'Edit a role (**WARNING** if you want to edit a role with space you need to manual edit it in config.json).',
      usage: 'editrole <name> <option> <value>',
      args: 1,
      aliases: ['roleedit'],
      permission: 'ADMINISTRATOR'
    });
  }

  run (message, args) {
    const embed = new Discord.RichEmbed()
      .setAuthor(message.guild.name)
      .setColor(0xff0000)
      .setFooter('Don\'t forget to do -setup/-reload after you edited roles!');
    const options = ['color', 'cooldown'];
    let role = args[0];
    if (!this.client.config.roles.find(x => x.name.toLowerCase() === role.toLowerCase())) {
      return message.channel.send(embed.setDescription('I can\'t find that role!'));
    } else {
      role = this.client.config.roles.find(x => x.name.toLowerCase() === role.toLowerCase()).name;
      if (!args[1]) {
        return message.channel.send(embed.setDescription(`${this.client.config.prefix}editrole <name> **<option>** <value>\nPossible options: ${role.toLowerCase() === 'default' ? options.filter(x => x !== 'color').join(', ') : options.join(', ')}`));
      }
      if (role.toLowerCase() === 'default' ? !options.filter(x => x !== 'color').find(x => x === args[1].toLowerCase()) : !options.find(x => x === args[1].toLowerCase())) {
        return message.channel.send(embed.setDescription(`${this.client.config.prefix}editrole <name> **<option>** <value>\nPossible options: ${role.toLowerCase() === 'default' ? options.filter(x => x !== 'color').join(', ') : options.join(', ')}`));
      }
      const option = options.find(x => x === args[1].toLowerCase());
      if (!args[2]) {
        return message.channel.send(embed.setDescription(`${this.client.config.prefix}editrole <name> <option> **<value>**`));
      }
      const value = args[2];
      const config = this.client.config.roles.find(x => x.name.toLowerCase() === role.toLowerCase());
      if (option === 'color') {
        var re = /[0-9A-Fa-f]{6}/g;
        const color = value.startsWith('#') ? value.substr(1) : value;
        if (re.test(color)) {
          config.color = '#' + color;
          this.client.rewriteConfig();
          message.channel.send(embed.setDescription(`${role}'s color is now: **#${color}**`));
        } else {
          message.channel.send(embed.setDescription('Thats not a valid hex color! Example: **#1b8cdf**'));
        }
      } else if (option === 'cooldown') {
        const cooldown = parseInt(value);
        if (isNaN(cooldown)) {
          return message.channel.send(embed.setDescription(`${value} is not a number!`));
        }
        config.cooldown = cooldown;
        this.client.rewriteConfig();
        message.channel.send(embed.setDescription(`${role}'s cooldown is now: **${cooldown}ms**`));
      } else {
        message.channel.send(embed.setDescription('Please contact <@261885314933587969>! And say: \'Invalid option setable.\''));
      }
      this.client.reload();
    }
  }
}

module.exports = EditRole;
