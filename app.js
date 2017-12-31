const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const { Client } = require('pg');
const dbURI = 'postgres://xvdswdww:BGIa3B60dgLwtLGukxwoQeAclbHr253j@baasu.db.elephantsql.com:5432/xvdswdww';
const client = new Client(dbURI);

client.connect();
const query = client.query('CREATE TABLE items(id SERIAL PRIMARY KEY, text VARCHAR(40) not null, complete BOOLEAN)');
query
    .then(() => client.end())
    .catch(err => console.log(err));


const corsOptions = {
    "origin": true,
    "methods": "GET, HEAD, PUT, PATCH, POST, DELETE",
    "preflightContinue": true,
    "optionsSuccessStatus": 204,
    "credentials": true, //enable cookies
};

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors(corsOptions));

// database connection with pg


app.listen(process.env.PORT || 3000, () => {
    console.log(`server listening on port ${ process.env.PORT || 3000 }`);
});