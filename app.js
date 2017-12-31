const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pg = require('pg');
const path = require('path');
const connectionString = 'postgres://xvdswdww:BGIa3B60dgLwtLGukxwoQeAclbHr253j@baasu.db.elephantsql.com:5432/xvdswdww';

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
    pg.connect(connectionString)
        .then((client, done) => {
            // insert data
            client.query('INSERT INTO items(text, complete) values($1, $2)', [todoObj.todo, todoObj.completed]);

            // SQL Query > Select Data
            const query = client.query('SELECT * FROM items ORDER BY id ASC');
            // Stream results back one row at a time
            query.on('row', (row) => {
            results.push(row);
            // after all reading is done
            })
            query.on('end', () => {
                done();
                return res.json(results);
            });
        })
        .catch(err => console.log('error: ', err));
});

app.use('/api', api);


app.listen(process.env.PORT || 3000, () => {
    console.log(`server listening on port ${ process.env.PORT || 3000 }`);
});