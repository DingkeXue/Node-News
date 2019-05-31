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

module.exports = {
    router: function () {
        const router = express.Router();

        router.use((req, res, next) => {
            if (!req.session['admin_id'] && req.url != '/login') {
                res.redirect('/admin/login');  // 没有登录
            } else {
                next();
            }
        });

        router.use('/login', require('./login')());

        router.get('/', (req, res) => {
           res.render('admin/index.ejs', {});
        });

        router.use('/banners', require('./banner')());

        router.use('/custom', require('./custom')());

        return router;
    },
};