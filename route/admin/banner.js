const express = require('express');
const mysql = require('mysql');
const common = require('../../libs/common.js');
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '12345',
    port: 3306,
    database: 'learn'
});

module.exports = function () {

    const router = express.Router();
    router.get('/', (req, res) => {
        switch (req.query.act) {
            case 'mod':
                db.query(`SELECT * FROM banner_table WHERE ID=${req.query.id}`, (err, data) => {
                    if (err) {
                        console.error(err);
                        res.status(500).send('database err').end();
                    } else if (data.length == 0) {
                        res.status(404).send().end();
                    } else {
                        db.query(`SELECT * FROM banner_table`, (err, banners) => {
                            if (err) {
                                console.error(err);
                                res.status(500).send('database err').end();
                            } else {
                                res.render('admin/banners.ejs', {banners, mod_data: data[0]});
                            }
                        })
                    }
                });
                break;
            case 'del':
                db.query(`DELETE FROM banner_table WHERE ID=${req.query.id}`, (err, data) => {
                    if (err) {
                        console.log(err);
                        res.status(500).send("database err").end();
                    } else {
                        res.redirect('/admin/banners');
                    }
                });
                break;
            default:
                db.query(`SELECT *  FROM banner_table`, (err, data) => {
                    if (err) {
                        console.log(err);
                        res.status(500).send('database err').end();
                    }  else {
                        res.render('admin/banners.ejs', {banners: data});
                    }
                });
        }
    });

    router.post('/', (req, res) => {
        let title = req.body.title;
        let description = req.body.description;
        let href = req.body.href;

        if (req.body.mod_id) {   // 修改
            db.query(`UPDATE banner_table SET title='${title}', description='${description}', href='${href}' WHERE ID = ${req.body.mod_id}`, (err, data) => {
                if (err) {
                    console.error(err);
                    res.status(500).send('database err').end();
                } else{
                    res.redirect('/admin/banners');
                }
            });
        } else {   // 添加
            if (!title || !description || !href) {
                res.status(400).redirect('/admin/banners');
            } else {
                db.query(`INSERT INTO banner_table (title, description, href) VALUES ('${title}', '${description}', '${href}')`, (err, data) => {
                    if (err) {
                        res.status(500).send('database err');
                    } else {
                        res.redirect('/admin/banners');
                    }
                });
            }
        }
    });

    return router;
};