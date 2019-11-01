const Base = require('../base/Command');

const Discord = require('discord.js');

class Roles extends Base {
  constructor (client) {
    super(client, {
      name: 'roles',
      description: 'Lists the roles.',
      usage: 'roles',
      aliases: ['listroles', 'roleslist'],
      permission: 'ADMINISTRATOR'
    });
  }

  run (message, args) {
    const embed = new Discord.RichEmbed()
      .setAuthor(message.guild.name)
      .setDescription('All roles.')
      .setFooter(`${this.client.config.prefix}setup to create all the roles in the discord! Want to edit a role? Use ${this.client.config.prefix}editrole <role>`)
      .setColor(0xff0000);
    this.client.reload();
    this.client.config.roles.forEach((role, i) => {
      embed.addField(role.name, `Cooldown: **${role.cooldown}ms**${role.color ? '\nColor: **' + role.color + '**' : ''}\nGenerators: **${role.generators.join(', ')}**`);
      if (i > 25) {
        message.channel.send(embed);
        embed.fields = [];
        i = 0;
      }
      if (i === this.client.config.roles.length - 1) {
        message.channel.send(embed);
      }
    });
  }
}

module.exports = Roles;
