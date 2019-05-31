const express = require('express');
const mysql = require('mysql');
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '12345',
    port: 3306,
    database: 'learn'
});

module.exports = {
    router: function () {
        const router = express.Router();

        router.get('/get_banner', (req, res) => {
            db.query(`SELECT * FROM banner_table`, (err, data) => {
                if (err) {
                    console.error(err);
                    res.status(500).send('database err').end();
                } else {
                    res.send(data).end();
                }
            })
        });

        router.get('/custom', (req, res) => {
            db.query(`SELECT * FROM custom_table`, (err, data) => {
                if (err) {
                    console.error(err);
                    res.status(500).send('database err').end();
                } else {
                    res.send(data);
                }
            })
        });

        return router;
    }
};