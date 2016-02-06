var express = require('express');
var mongoose = require('mongoose');
var body_parser = require('body-parser');
var path = require('path');
var fs = require('fs');

var app = express();

const environment = app.get('env');

const configs_path = path.join(__dirname, 'configs');
const models_path = path.join(__dirname, 'models');
const views_path = path.join(__dirname, 'views');
const controllers_path = path.join(__dirname, 'controllers');
const public_path = path.join(__dirname, 'public');

const config = require(path.join(configs_path, environment));

mongoose.connect(config.database.mongodb_uri);

app.set('views', views_path);
app.set('view engine', 'jade');
app.locals.pretty = config.rendering.pretty_html;

app.use(body_parser.json());
app.use(body_parser.urlencoded({extended: false}));
app.use(express.static(public_path));


// loading models dynamically
fs.readdirSync(models_path).forEach(function (model_file_name) {
    if ('.js' === model_file_name.substr(-3)) {
        var model_path = path.join(models_path, model_file_name);

        require(model_path)(mongoose);
    }
});

// loading controllers (a.k.a routers) dynamically
fs.readdirSync(controllers_path).forEach(function (controller_file_name) {
    if ('.js' === controller_file_name.substr(-3)) {
        var controller_path = path.join(controllers_path, controller_file_name);

        require(controller_path)(app, mongoose);
    }
});

// catch 404 and forward to error handler
app.use(function (request, response, next) {
    var error = new Error('Not Found');

    error.status = 404;

    next(error);
});

// error handlers
if ('development' === environment) {
    // development error handler
    app.use(function (error, request, response, next) {
        response.status(error.status || 500);

        response.render('error', {
            message: error.message,
            error: error
        });
    });
} else {
    // production error handler
    app.use(function (error, request, response, next) {
        response.status(error.status || 500);

        response.render('error', {
            message: error.message,
            error: {}
        });
    });
}

module.exports = app;
