//
//this file descrive "Server and rooting main"
//

//requires
var async           = require('async');
var express         = require("express");
var http            = require('http');
var socketio        = require('socket.io');
var connectmongo    = require('connect-mongo');
var mongoose        = require('mongoose');
var session         = require('express-session');
var sharedsession   = require("express-socket.io-session");
var bodyParser      = require('body-parser');
var cookieParser    = require('cookie-parser');
var morgan          = require('morgan');
var route           = require("./container/controllers/route.js");
var socketRouter    = require("./container/controllers/socketRouter.js");
var settings        = require("./container/xPublic/settings.js");

//start-up
var MongoStore = connectmongo(session);
mongoose.connect(settings.mongoUrl);
var app = express();
var server = http.createServer(app);
var io = socketio.listen(server);
var model = require('./container/models/model.js');
var User  = model.User;
var GameTable  = model.GameTable;

//app-set
app.set("views","./container/views");
app.set("view engine","ejs");

//app-use (midleware)
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());//req.body for nodeUnderstandable.
app.use(morgan("dev"));//logmessage for dvelopmentMode
app.use(express.static(__dirname+"/container/xPublic"));//staticFiles are in xpublic.requestParam is just "FILE_NAME".
app.use(cookieParser());//cookei-parser needed for session

var sessionUse = session({
    secret: settings.sessionSecret, //secret-key
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({                         //where to stock sessions-data?
        mongooseConnection: mongoose.connection     //use mongoose's connection!
    }),
    cookie: settings.sessionCookie
});

app.use(sessionUse);
io.use(sharedsession(sessionUse,{autoSave:true})); 

//rooting (access to /controllers/route.js)
app.get ( '/'      , route.loginCheck , route.root ); 
app.get ('/login'  , route.login     );
app.get ('/logout' , route.logout    );
app.post('/add'    , route.add       );
app.get ('/osero/:id',route.osero     );

//socket-rooting (access to /controllers/socketRouter.js")
io.on('connection', function(socket){
    socketRouter.start(io);
    socket.on( 'loadHome'         ,function(data){ socketRouter.loadHome(socket,data)           });
    socket.on( 'createGameTable'  ,function(data){ socketRouter.createGameTable(socket,data)    });
    socket.on( 'removeGameTable'  ,function(data){ socketRouter.removeGameTable(socket,data)    });
    socket.on( 'logout'           ,function(data){ socketRouter.logout(socket,data)             });
    socket.on( 'seating'          ,function(data){ socketRouter.seating(socket,data)            });
});

server.listen(process.env.PORT);
