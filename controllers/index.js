var express = require('express');
var router = express.Router();

module.exports = function (app, mongoose) {
    router.get('/', function (request, response, next) {
        var options = {
            page_title: 'ToDo Home'
        };

        response.render('index', options);
    });

    app.use('/', router);
};