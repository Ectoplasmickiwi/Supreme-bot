const Base = require('../base/Command');

class Say extends Base {
  constructor (client) {
    super(client, {
      name: 'say',
      description: 'Let the bot say somethings.',
      usage: 'say <text>',
      permission: 'ADMINISTRATOR'
    });
  }

  run (message, args) {
    var newMessage = message.content.replace(`${this.client.config.prefix}say `, '');
    newMessage = newMessage.replace(`${this.client.config.prefix}say`, '');
    message.channel.send(newMessage);
    message.delete();
  }
}

module.exports = Say;
