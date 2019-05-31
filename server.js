const express = require('express');
const route = require('express-route');
const expressStatic = require('express-static');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const consolidate = require('consolidate');
const multerObj = multer({dest: './static/upload'});


const server = express();

// 1.获取请求数据，get 自带
server.use(bodyParser.urlencoded());
server.use(multerObj.any());

// 获取cookie,session
server.use(cookieParser());

(function () {
    let arr = [];
    for (let i = 0; i < 1000; i++) {
        arr.push("key_" + Math.random());
    }

    server.use(cookieSession({
        name: 'red',
        keys: arr,
        maxAge: 100*60*1000
    }));
})();


/*
* 适配 ejs
* */
server.engine('html', consolidate.ejs);
server.set('view engine', 'html');
server.set('views', './template');

// route
server.use('/', require('./route/web/index').router());
server.use('/admin/', require('./route/admin/admin').router());


server.use(expressStatic('./static'));
server.listen(8080);