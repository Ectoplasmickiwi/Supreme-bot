const {
  Client,
  Collection
} = require('discord.js');
const {
  readdir,
  writeFileSync,
  readFileSync
} = require('fs');
const path = require('path');
/**
 * Represents a Discord client
 * @extends Discord.Client
 */
class CustomClient extends Client {
  /**
     * @param {Object} options The options passed to the client
     * @param {Object} options.clientOptions The client options used by the original discord.js client
     * @param {Object} options.config The filepath to the config file
     * @param {Object} options.perms The permission levels file
     */
  constructor (options) {
    // Initialise discord.js client with supplied client options
    super(options.clientOptions || {});

    /**
         * A collection of all of the bot's commands
         * @type {Discord.Collection}
         */
    this.commands = new Collection();
    /**
         * A collection of all of the bot's command aliases
         * @type {Discord.Collection}
         */
    this.aliases = new Collection();

    // Client variables
    /**
         * The bot's configuration - empty if no file was specified
         * @type {Object}
         */
    this.config = options.config ? require(`../${options.config}`) : {};

    this.configpath = options.config;

    /**
         * The bot's permission levels
         * @type {Object}
         */
    this.perms = options.perms ? require(`../${options.perms}`) : {};
    /**
         * The bot's database
         * @type {Object}
         */
    this.db = require('../utils/db.js');
  }

  /**
     * Logs the client in
     * @param {String} token The token used to log the client in
     */
  login (token) {
    // Log super in with the specified token
    super.login(token);

    // Return this client to allow chaining of function calls
    return this;
  }

  /**
     * Re-write the config file
     */
  rewriteConfig () {
    writeFileSync(path.join(__dirname, '../config.json'), JSON.stringify(this.config, null, 4));
  }

  /**
     * Re-load the config
     */
  reload () {
    this.config = JSON.parse(readFileSync(path.join(__dirname, `../${this.configpath}`)));
  }

  /**
     * Loads all commands in the directory
     * @param {String} path The path where the commands are located
     */
  loadCommands (path) {
    readdir(path, (err, files) => {
      if (err) console.log(err);

      files.forEach(cmd => {
        console.log('Loading cmd: ' + cmd);
        const command = new (require(`../${path}/${cmd}`))(this);

        this.commands.set(command.help.name, command);

        command.conf.aliases.forEach(a => this.aliases.set(a, command.help.name));
      });
    });

    return this;
  }

  /**
     * Loads all events in the directory
     * @param {String} path The path where the events are located
     */
  loadEvents (path) {
    readdir(path, (err, files) => {
      if (err) console.log(err);

      files.forEach(evt => {
        console.log('Loading event: ' + evt);
        const event = new (require(`../${path}/${evt}`))(this);

        super.on(evt.split('.')[0], (...args) => event.run(...args));
      });
    });

    return this;
  }
}

module.exports = CustomClient;
