var knex = require('knex')({
    client: 'mysql2',
    connection: {
      host : '127.0.0.1',
      user : 'root',
      password : 'xa06082002@I',
      database : 'apiusers2'
    }
  });

module.exports = knex