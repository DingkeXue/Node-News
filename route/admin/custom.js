const express = require('express');
const mysql = require('mysql');
const pathLib = require('path');
const fs = require('fs');
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
                        db.query(`SELECT * FROM custom_table`, (err, custom) => {
                            if (err) {
                                console.error(err);
                                res.status(500).send('database err').end();
                            } else {
                                res.render('admin/custom.ejs', {custom, mod_data: data[0]});
                            }
                        })
                    }
                });
                break;
            case 'del':
                db.query(`DELETE FROM cusotm_table WHERE ID=${req.query.id}`, (err, data) => {
                    if (err) {
                        console.log(err);
                        res.status(500).send("database err").end();
                    } else {
                        res.redirect('/admin/custom');
                    }
                });
                break;
            default:
                db.query(`SELECT *  FROM custom_table`, (err, data) => {
                    if (err) {
                        console.log(err);
                        res.status(500).send('database err').end();
                    }  else {
                        res.render('admin/custom.ejs', {custom: data});
                    }
                });
        }
    });

    router.post('/', (req, res) => {
       let title = req.body.title;
       let description = req.body.description;
       let oldPath = req.files[0].path;
       let ext = pathLib.parse(req.files[0].originalname).ext;
       let newPath  = req.files[0].path + ext;
       let newFileName = req.files[0].filename + ext;

       fs.rename(oldPath, newPath, (err) => {
           if (err) {
               res.status(500).send('rename err').end();
           } else {
               if (req.body.mod_id) {  // 修改
                    db.query(`UPDATE custom_table SET title='${title}', description='${description}', src='${newFileName}' WHERE ID=${req.body.mod_id}`, (err, data) =>{
                       if (err) {
                           console.error(err);
                           res.status(500).send('database err').end();
                       }  else {
                           res.redirect('/admin/custom');
                        }
                    });
               } else {
                   if (!title || !description) {
                       res.redirect('/admin/custom');
                   } else {
                       db.query(`INSERT INTO custom_table (title, description, src) VALUES ('${title}','${description}', '${newFileName}' )`, (err, data) => {
                           if (err) {
                               console.error(err);
                               res.status(500).send('database err').end();
                           }  else {
                               res.redirect('/admin/custom');
                           }
                       });
                   }
               }
           }
       });
    });

    return router;

};