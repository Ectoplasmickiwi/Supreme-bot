const mysql = require('mysql');
const connection = mysql.createConnection(require('../config.json').database);
connection.connect((err) => {
  if (err) {
    console.error(`Could not connect to database\n${err}`);
    process.exit();
  } else {
    console.log('Connected to database!');
  }
});

module.exports.connection = connection;

module.exports.query = (sql, done = undefined) => {
  connection.query(sql, (err, result, fields) => {
    if (err) {
      console.error(err);
      process.exit(1);
    } else if (done) {
      done(result, fields);
    }
  });
};
