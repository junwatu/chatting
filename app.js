var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var debug = require('debug')('apps');
var io = require('socket.io');
//var socketHandshake = require('socket.io-handshake');
var reqSocket = require('./routes/socket.js');

var routes = require('./routes/index');
var users = require ('./routes/users');

var app = express();
var memoryStore = session.MemoryStore;
var sessionStore = new memoryStore();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('port', process.env.PORT || 3000);

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('verysecretkey'));
app.use(express.static(path.join(__dirname, 'public')));

var sessionConfig = {
    store: sessionStore, 
    key:'sid',
    secret:'verysecretkey', 
    parser:cookieParser()
};

var sessionMiddleware = session(sessionConfig);

app.use(sessionMiddleware);

app.locals.pretty = true;

app.use('/', routes);
app.use('/users', users);

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

var server = app.listen(app.get('port'), function() {
    debug('Express server listening on port ' + server.address().port);
});

io = io.listen(server);
io.use(function(socket, next){
    sessionMiddleware(socket.request, socket.request.res, next);
});

//reqSocket.initialize(io);

var chatInfra =  io.of('/chat_infra');
chatInfra.on('connection', function(socket) {
        socket.on('set_name', function(data) {
            socket.request.session.name = data.name;
            socket.emit('name_set', data);
            socket.send(JSON.stringify({
                type: 'serverMessage',
                message: '#=====w.e.l.c.o.m.e=====#'
            }));
            data.type = 'serverMessage';
            socket.broadcast.emit('user_entered', data);

            socket.on('disconnect', function() {
                socket.broadcast.emit('user_disconnect', data);
            });
        });
    });

var chatCom = io.of('/chat_com');
chatCom.on('connection', function(socket) {
        socket.on('message', function(message) {
            message = JSON.parse(message);  
            if(message.type == 'userMessage') {
                message.username = socket.request.session.name;
                socket.broadcast.send(JSON.stringify(message));
                message.type = 'myMessage';
                socket.send(JSON.stringify(message))
            }
        });
    });

//module.exports = app;
