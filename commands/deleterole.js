const Base = require('../base/Command');

const Discord = require('discord.js');

class DeleteRole extends Base {
  constructor (client) {
    super(client, {
      name: 'deleterole',
      description: 'Delete a role.',
      usage: 'deleterole <name>',
      args: 1,
      aliases: ['delrole', 'removerole', 'roleremove', 'roledelete'],
      permission: 'ADMINISTRATOR'
    });
  }

  run (message, args) {
    const embed = new Discord.RichEmbed()
      .setAuthor(message.guild.name)
      .setColor(0xff0000);
    if (this.client.config.roles.find(x => x.name.toLowerCase() === args.join(' ').toLowerCase())) {
      const i = this.client.config.roles.findIndex(x => x.name.toLowerCase() === args.join(' ').toLowerCase());
      this.client.config.roles.splice(i, 1);
      this.client.rewriteConfig();
      this.client.reload();
      message.channel.send(embed.setDescription(`I deleted the ${args.join(' ')} role!`));
    } else {
      message.channel.send(embed.setDescription('I can\'t find that role!'));
    }
  }
}

module.exports = DeleteRole;
