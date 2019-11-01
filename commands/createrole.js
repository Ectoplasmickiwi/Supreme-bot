const Base = require('../base/Command');

const Discord = require('discord.js');

class CreateRole extends Base {
  constructor (client) {
    super(client, {
      name: 'createrole',
      description: 'Create a role.',
      usage: 'createrole <name>',
      args: 1,
      aliases: ['makerole', 'rolemake', 'rolecreate', 'addrole', 'roleadd'],
      permission: 'ADMINISTRATOR'
    });
  }

  run (message, args) {
    const embed = new Discord.RichEmbed()
      .setAuthor(message.guild.name)
      .setColor(0xff0000);
    this.client.reload();
    if (this.client.config.roles.find(x => x.name.toLowerCase() === args.join(' ').toLowerCase())) {
      return message.channel.send(embed.setDescription('That role already exists!'));
    }
    this.client.config.roles = [...this.client.config.roles, { name: args.join(' '), color: '#000000', cooldown: 86400000 }];
    this.client.rewriteConfig();
    message.channel.send(embed.setDescription(`Added ${args.join(' ')} as role!`).setFooter(`To make this role on the discord guild please do ${this.client.config.prefix}setup!`));
  }
}

module.exports = CreateRole;
