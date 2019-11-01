const Base = require('../base/Command');

const Discord = require('discord.js');

class AddGeneratorToRole extends Base {
  constructor (client) {
    super(client, {
      name: 'addgeneratortorole',
      description: 'Adds a generator to a role (**WARNING** if you want to add a generator to a role with a space you need to manual edit it inconfig.json)',
      usage: 'addgeneratortorole <role> <generator>',
      args: 2,
      aliases: ['generatoraddtorole', 'addgentorole', 'addgenrole', 'genaddrole', 'generatoraddrole', 'roleaddtogen', 'genaddtorole'],
      permission: 'ADMINISTRATOR'
    });
  }

  run (message, args) {
    const embed = new Discord.RichEmbed()
      .setAuthor(message.guild.name)
      .setColor(0xff0000);
    this.client.reload();
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
      return message.channel.send(embed.setDescription(`${role.name} already got ${generator} as generator!`));
    }
    role.generators.push(generator);
    this.client.rewriteConfig();
    message.channel.send(embed.setDescription(`I added ${generator} to ${role.name}!\nGenerators: ${role.generators.join(', ')}`));
  }
}

module.exports = AddGeneratorToRole;
