//
//this file descrive "rooting contents dataHandling"
//
var async = require("async");
var model = require('.././models/model.js');
var User  = model.User;
var GameTable  = model.GameTable;
var socket;

exports.start = function(data){
    socket = data;
}
exports.removeGameTable = function(id){
    var query = {
        _id : id
    }
    var errRoute;
    var failRoute = function(){ console.log(id)};
    var succesRoute = function(){
        socket.broadcast.emit("reloadGameTable");
    };
    GameTable.remove_pvd(query,errRoute,failRoute,succesRoute);
}
exports.disconnect = function(){
    var query = {
        "name" : socket.handshake.session.user
    }
    socket.broadcast.emit("reloadLoginUsers",query);
    console.log("disconnect",socket.handshake.session.user);
    User.set_pvd(query,{"logStatus":"logout"});
}
exports.createGameTable = function(query){
    console.log("createGameTable");
    GameTable.add_pvd(query,"","",function(data){
        console.log(data);
        var newGameTable = {
            "gameTable" : {
                data
            },
        };
        console.log(newGameTable.gameTable);
        socket.emit("reloadGameTable",newGameTable);
        socket.broadcast.emit("reloadGameTable",newGameTable);
    });
};

exports.seeds = function(data){
    console.log("seeds");
    async.series([
        function(callback){
            User.set_pvd({"user":socket.handshake.session.user},{"logStatus":"login"},"","",function(){
                callback(null,"");
            });
        },
        function(callback){
            User.find_pvd({},"","",function(user_buf){
                callback(null,user_buf);
            });
        },
        function(callback){
            GameTable.find_pvd({},"","",function(gameTable_buf){
                callback(null,gameTable_buf);
            }); 
        }],
        function(err,results){
            data = {
                "you"         : socket.handshake.session.user,
                "User"        : results[1],//user_buf
                "gameTable"   : results[2],//gameTable_buf
            };
            socket.emit("seeds",data);
        }
    );
};
