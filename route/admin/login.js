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
        res.render('admin/login.ejs', {});
    });

    router.post('/', (req, res) => {
        let user = req.body.user;
        let pass = common.md5(req.body.pass + common.MD5_suffix);

        db.query(`SELECT * FROM admin_table WHERE username='${user}'`, (err, data) => {
            if (err) {
                res.status(500).send("this is a error about database").end();
            }  else {
                if (data.length == 0) {
                    res.status(400).send('no this admin').end();
                } else {
                    if (data[0].password == pass) { // 登录成功
                        req.session['admin_id'] = data[0].ID;
                        res.redirect('/admin/');
                    } else {
                        res.status(400).send('password error').end();
                        res.redirect('admin/login');
                    }
                }
            }
        });
    });

    return router;

};