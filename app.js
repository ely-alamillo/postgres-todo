const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');
const connectionString = 'postgres://xvdswdww:BGIa3B60dgLwtLGukxwoQeAclbHr253j@baasu.db.elephantsql.com:5432/xvdswdww';

const pool = new Pool({
    host: 'baasu.db.elephantsql.com',
    user: 'xvdswdww',
    password: 'BGIa3B60dgLwtLGukxwoQeAclbHr253j',
    database: 'xvdswdww',
    port: 5432,
    max: 5,
    idleTimeoutMillis: 20000,
    connectionTimeoutMillis: 3000,
});

// the pool with emit an error on behalf of any idle clients
// it contains if a backend error or network partition happens
pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
});

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

 /*--------------------------------------
 =            API ROUTES                 =
 ----------------------------------------*/
const api = express.Router();
api.post('/todos', (req, res) => {
    const results = [];
    const { todo } = req.body;
    const todoObj = { todo, completed: false };
    pool.connect()
        .then((client) => {
            
            // insert data
            client.query('INSERT INTO items(text, complete) values($1, $2)', [todoObj.todo, todoObj.completed]);

            // SQL Query > Select Data
            const query = client.query('SELECT * FROM items ORDER BY id ASC');
            query
                .then((data) => res.json(data))
        })
        .catch(err => console.log('error: ', err));
});

app.use('/api', api);


app.listen(process.env.PORT || 3000, () => {
    console.log(`server listening on port ${ process.env.PORT || 3000 }`);
});