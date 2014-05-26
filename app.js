var express = require('express'),
    http = require('http'),
    path = require('path'),
    config = require('config'),
    log = require('libs/log')(module),
    HttpError = require('error').HttpError,
    app = module.exports = express();

app.engine('ejs', require('ejs-locals'));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/template');

if (app.get('env') == 'development') {
    app.use(express.logger('dev'));
} else {
    app.use(express.logger('default'));
}

app.use(express.bodyParser());
app.use(express.cookieParser());

app.use(express.session({
    secret: config.get('session:secret'),
    key: config.get('session:key'),
    cookie: config.get('session:cookie')
}));


app.use(require('middleware/sendHttpError'));

app.use(app.router);
require('routes')(app);

app.use(express.static(__dirname + '/public'));

app.use(function(err, req, res, next) {
    if (typeof err == 'number') { // next(404);
        err = new HttpError(err);
    }

    if (err instanceof HttpError) {
        res.sendHttpError(err);
    } else {
        if (app.get('env') == 'development') {
            express.errorHandler()(err, req, res, next);
        } else {
            log.error(err);
            err = new HttpError(500);
            res.sendHttpError(err);
        }
    }
});

http.createServer(app).listen(config.get('port'), function(){
    log.info('Express server listening on port ' + config.get('port'));
});
