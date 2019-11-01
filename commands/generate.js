const Base = require('../base/Command');

const Discord = require('discord.js');

class Generate extends Base {
  constructor (client) {
    super(client, {
      name: 'generate',
      description: 'Generates an alt.',
      usage: 'generate <alt type>',
      args: 1,
      aliases: ['gen', 'genalt', 'alt', 'generatealt', 'altgen', 'altgenerate']
    });
    Object.defineProperty(this, 'usercooldown', { value: [], writeable: true });
  }

  run (message, args) {
    const embed = new Discord.RichEmbed()
      .setAuthor(message.guild.name)
      .setColor(0xff0000);
    this.client.reload();
    if (this.usercooldown.some(x => x.user === message.author.id)) {
      const time = timeUnitsBetween(new Date(), this.usercooldown.find(x => x.user === message.author.id).date);
      if (time.hours > 0) {
        return message.channel.send(embed.setDescription(`Sorry, you are still in cooldown!\nTime left: **${time.hours} hours ${time.minutes} minutes.**`));
      } else if (time.minutes > 0) {
        return message.channel.send(embed.setDescription(`Sorry, you are still in cooldown!\nTime left: **${time.minutes} minutes.**`));
      } else {
        return message.channel.send(embed.setDescription(`Sorry, you are still in cooldown!\nTime left: **${time.seconds} seconds.**`));
      }
    }
    const loading = this.client.emojis.find(x => x.name === 'loading') || ':arrows_counterclockwise:';
    let type;
    if (this.client.config.generators.some(x => x.toLowerCase() === args.join(' ').toLowerCase())) {
      type = this.client.config.generators.find(x => x.toLowerCase() === args.join(' ').toLowerCase());
    } else {
      return message.channel.send(embed.setDescription('Sorry, i can\'t find that alt type! Alt types:\n' + this.client.config.generators.map(x => '- ' + x).join('\n')));
    }
    const usergens = [];
    let cooldown = 9999999999999999999999;
    this.client.config.roles.forEach(role => {
      if (message.member.roles.some(x => x.name.toLowerCase() === role.name.toLowerCase()) || role.name.toLowerCase() === 'default') {
        role.generators.forEach(g => {
          usergens.push(g);
        });
        if (role.cooldown < cooldown) {
          cooldown = role.cooldown;
        }
      }
    });
    if (!usergens.includes(type)) {
      message.channel.send(embed.setDescription('Sorry, you can\'t use that generator!'));
    } else {
      this.client.db.query(`SELECT EXISTS(SELECT * FROM information_schema.tables WHERE table_schema = "${this.client.config.database.database}" AND table_name = "${type}");`, result => {
        if (result[0][Object.keys(result[0])[0]] === 1) {
          message.channel.send(embed.setDescription(`${loading} Generating...`)).then(msg => {
            this.client.db.query(`SELECT alt FROM \`${type}\`ORDER BY RAND ( ) LIMIT 1`, (result) => {
              if (!result[0]) {
                return msg.edit(embed.setDescription('This account type is out of stock!'));
              }
              message.author.send(embed.setAuthor(`${type} alt.`).setDescription(result[0].alt))
                .then(() => {
                  msg.edit(embed.setAuthor(message.guild.name).setDescription('Your alt is now in your dm!'));
                  if (this.client.config.deletegeneratedaltsfromdatabase === true) {
                    this.client.db.query(`DELETE FROM \`${type}\` WHERE alt = '${result[0].alt}' LIMIT 1`);
                  }

                  const date = new Date();
                  this.usercooldown.push({
                    user: message.author.id,
                    date: date.setSeconds(date.getSeconds() + cooldown / 1000)
                  });
                  setTimeout(() => {
                    const i = this.usercooldown.findIndex(x => x.user === message.author.id);
                    this.usercooldown.splice(i, 1);
                  }, cooldown);
                })
                .catch(() => msg.edit(embed.setAuthor(message.guild.name).setDescription('Please enable your dms!')));
            });
          });
        } else {
          message.channel.send(embed.setDescription('That generator is not in the database! Ask an admin to use -setup to add it!'));
        }
      });
    }
    function timeUnitsBetween (startDate, endDate) {
      let delta = Math.abs(endDate - startDate) / 1000;
      const isNegative = startDate > endDate ? -1 : 1;
      return [
        ['days', 24 * 60 * 60],
        ['hours', 60 * 60],
        ['minutes', 60],
        ['seconds', 1]
      // eslint-disable-next-line
      ].reduce((acc, [key, value]) => (acc[key] = Math.floor(delta / value) * isNegative, delta -= acc[key] * isNegative * value, acc), {});
    }
  }
}

module.exports = Generate;
