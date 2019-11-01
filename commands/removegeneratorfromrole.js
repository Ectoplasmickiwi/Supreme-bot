const Base = require('../base/Command');

const Discord = require('discord.js');

class RemoveGeneratorFromRole extends Base {
  constructor (client) {
    super(client, {
      name: 'removegeneratorfromrole',
      description: 'Removes a generator from a role (**WARNING** if you want to add a generator to a role with a space you need to manual edit it inconfig.json)',
      usage: 'addgeneratorfromrole <role> <generator>',
      args: 2,
      aliases: ['generatorremovefromrole', 'removegenfromrole', 'removegenrole', 'genremoverole', 'generatorremoverole', 'roleremovefromgen', 'genremovefromrole'],
      permission: 'ADMINISTRATOR'
    });
  }

  run (message, args) {
    const embed = new Discord.RichEmbed()
      .setAuthor(message.guild.name)
      .setColor(0xff0000);
    const r = args.shift();
    const role = this.client.config.roles.find(x => x.name.toLowerCase() === r.toLowerCase());
    if (!role) {
      return message.channel.send(embed.setDescription('That role does not exists!'));
    }
    const generator = this.client.config.generators.find(x => x === args.join(' '));
    if (!generator) {
      return message.channel.send(embed.setDescription(`Generator ${args.join(' ')} does not exists!`));
    }
    if (role.generators.includes(generator)) {
      role.generators.splice(role.generators.findIndex(x => x === generator), 1);
      this.client.rewriteConfig();
      this.client.reload();
      message.channel.send(embed.setDescription(`I removed ${generator} from ${role.name}!\nGenerators left: ${role.generators.join(', ')}`));
    } else {
      return message.channel.send(embed.setDescription(`${role.name} does not have the ${generator} generator!`));
    }
  }
}

module.exports = RemoveGeneratorFromRole;
