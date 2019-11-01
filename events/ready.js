module.exports = class {
  constructor (client) {
    this.client = client;
  }

  run () {
    this.client.user.setActivity(`${this.client.config.prefix}help`, {
      type: 'WATCHING'
    });
  }
};
