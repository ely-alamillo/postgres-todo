const { Client } = require('pg');
const dbURI = 'postgres://xvdswdww:BGIa3B60dgLwtLGukxwoQeAclbHr253j@baasu.db.elephantsql.com:5432/xvdswdww';
const client = new Client(dbURI);

client.connect();
const query = client.query('CREATE TABLE items(id SERIAL PRIMARY KEY, text VARCHAR(40) not null, complete BOOLEAN)');
query
    .then(() => { console.log('it worked'); client.end()})
    .catch(err => console.log(err));