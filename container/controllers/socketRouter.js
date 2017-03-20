//
//this file provide 4 part,
//
//1. Authentication check . socketEvent is Regular or not . (<= but this version not supported.)
//2. Model handling . Directry handling Model part is this part only.
//3. ViewParts handling . preload ejsFiles for viewParts, and render ejs, pass to socket.
//4. Socket emit. above procces's status or data shold emit collect eventName and collect contents.
//

//requires
var async = require("async");
var goNext = require(".././xPublic/goNext.js");//suport for async
var model = require('.././models/model.js');
var ejs = require('ejs');
var fs = require('fs');

function peelSingleObject(singleObject){
    return singleObject[0];
}


//set vars
var io;
var ViewsDir_ = './container/views/';

//set Models
var User  = model.User;
var GameTable  = model.GameTable;
var GameType    = model.GameType;

//set ViewParts
var loginusersList  = fs.readFileSync(ViewsDir_+'home/loginusersList.ejs','utf8');
var gameTableList   = fs.readFileSync(ViewsDir_+'home/gameTableList.ejs','utf8');
var forNewLoginList = fs.readFileSync(ViewsDir_+'home/forNewLoginList.ejs','utf8');
var forNewCngOpt    = fs.readFileSync(ViewsDir_+'home/forNewCngOpt.ejs','utf8');
var createGameTable = fs.readFileSync(ViewsDir_+'home/createGameTable.ejs','utf8');

//connect soket.io
exports.start = function(onIo){
    io = onIo;
};

//set soket_router
exports.loadHome = function(socket){
    console.log("loadHome");
    var yourName = socket.handshake.session.user;
    async.series(
        [
            function(next){
                User.set_pvd({"name":yourName},{"logStatus":"login"},goNext(next));
            },
            function(next){
                GameType.find_pvd({},goNext(next)); 
            },
            function(next){
                User.find_pvd({"logStatus":"login"},goNext(next)); 
            },
            function(next){
                GameTable.find_pvd({},goNext(next),goNext(next)); 
            },
            function(next){
                User.find_pvd({"name":yourName},goNext(next));
            }
        ],
        function(err,results){
            if(err){ throw err }
            var dataQuery = {      //this Object is json's data.
                "gameType"       : results[1],
                "loginUsers"     : results[2],//loginusers_buf
                "gameTable"      : results[3],//gameTable_buf
                "you"            : peelSingleObject(results[4]),
            };
            var viewPartsQuery = {       //this Object is html data.
                "createGameTable": ejs.render(createGameTable,dataQuery),
                "loginusersList" : ejs.render(loginusersList,dataQuery),
                "gameTableList"  : ejs.render(gameTableList,dataQuery),
                "forNewLoginList": ejs.render(forNewLoginList,dataQuery),
                "forNewCngOpt"   : ejs.render(forNewCngOpt,dataQuery),
            };
            socket.emit('loadHome',viewPartsQuery);
            socket.broadcast.emit('addLoginUser',{
                newLoginList : viewPartsQuery.forNewLoginList,
                newCngOpt    : viewPartsQuery.forNewCngOpt,
                newLoginID   : dataQuery.you._id,
            });
        }
    );
};
exports.createGameTable = function(socket,query){
    console.log("createGameTable");
    async.series(
        [
            function(next){
                GameTable.add_pvd(query,goNext(next));
            },
        ],
        function(err,results){
            if(err){ throw err }
            var dataQuery = {
                "gameTable" :  results[0] ,
            };
            var viewPartsQuery = {
                "gameTableList"  : ejs.render(gameTableList,dataQuery),
            };
            socket.emit("addGameTable",viewPartsQuery);
            socket.broadcast.emit("addGameTable",viewPartsQuery);
            
            socket.join("gametable_id_"+peelSingleObject(dataQuery.gameTable)._id);
            console.log("create:","gametable_id_"+peelSingleObject(dataQuery.gameTable)._id);
        }
    );
};
exports.logout = function(socket,logoutUserName){
    async.series(
        [
            function(next){
                User.set_pvd({"name":logoutUserName},{"logStatus":"logout"},goNext(next));
            },
            function(next){
                User.find_pvd({"name":logoutUserName},goNext(next));
            },
        ],
        function(err,results){
            if(err){ throw err }
            var dataQuery = {
                "user" :  results[1] ,
            };
            //socket.emit("removeLoginUser",dataQuery);
            //socket.broadcast.emit("removeLoginUser",dataQuery);
            io.sockets.emit("removeLoginUser",dataQuery);
        }
    );
};
exports.removeGameTable = function(socket,id){
    var query = {
        _id : id
    };
    GameTable.remove_pvd(query,function(){
        io.sockets.emit('removeGameTable',query);
    });
};
exports.seating = function(socket,query){
    console.log(query);
    //if seating is regal, go below proces. if NOT, alert YOU ARE NOT REGAL.
    async.series(
        [
            function(next){
                User.set_pvd({"name":query.user},{"where":"gameTable_id_"+query.gameTable_id},goNext(next));
            },
            function(next){
                GameTable.set_pvd({"_id":query.gameTable_id},{"participants":query.user,"seatStatus":"seated"},goNext(next));
            },
            function(next){
                GameTable.find_pvd({"_id":query.gameTable_id},goNext(next));
            },
        ],
        function(err,results){
            if(err){ throw err }
            var gameTable = peelSingleObject(results[2]);
            socket.join("gametable_id_"+gameTable._id);
            console.log("join:","gametable_id_"+gameTable._id);            
            if ( gameTable.seatStatus == "seated" ) {//
                io.sockets.to("gametable_id_"+gameTable._id).emit("goGameRoom",gameTable);
            }else{
                socket.emit("reloadHome");
            }
        }
    );
};