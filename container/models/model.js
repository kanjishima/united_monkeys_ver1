var mongoose = require('mongoose');
var settings = require(".././xPublic/settings.js");

var url = settings.mongoUrl;

mongoose.Promise = global.Promise;
var db  = mongoose.createConnection(url, function(err, res){
    if(err){
        console.log('Error connected: ' + url + ' - ' + err);
    }else{
        console.log('Success connected: ' + url);
    }
});

// Modelの定義
var UserSchema = new mongoose.Schema({
    name     : { type: String },
    password : { type: String },
    logStatus: { type: String },
    where    : { type: String },
},{collection: 'User'});

var GameTypeSchema = new mongoose.Schema({
    name        : { type: String },
    min_players : { type: Number },
    max_players : { type: Number },
    option      : { type: Array  },
},{collection: 'GameType'});

var GameTableSchema  = new mongoose.Schema({
    owner       : { type: String },
    gametype    : { type: String },
    status      : { type: String },
    participants: { type: String },
    seatStatus  : { type: String },
    game_content: { type: String },
},{collection: 'GameTable'}); 


///////
var User = db.model('User', UserSchema);
User.find_pvd = find_pvd;
User.add_pvd = add_pvd;
User.set_pvd = set_pvd;
User.remove_pvd = remove_pvd;
exports.User = User;
///////
var GameType = db.model('GameType', GameTypeSchema);
GameType.find_pvd = find_pvd;
GameType.add_pvd = add_pvd;
GameType.set_pvd = set_pvd;
GameType.remove_pvd = remove_pvd;
exports.GameType = GameType;
///////
var GameTable = db.model('GameTable', GameTableSchema);
GameTable.find_pvd = find_pvd;
GameTable.add_pvd = add_pvd;
GameTable.set_pvd = set_pvd;
GameTable.remove_pvd = remove_pvd;
exports.GameTable = GameTable;
//////




function find_pvd(query,succesRoute,failRoute,errRoute){
    var Model = this;
    var funcName = find_pvd.name;
    var ModelName = Model.modelName;
    Model.find(query, function(err, data){
        if(err){
            console.log(ModelName,funcName,"errRoute",err);
            if(typeof(errRoute) == "function"){
                errRoute();
            }
        }
        if(data == ""){
            console.log(ModelName,funcName,"failRoute");
            if(typeof(failRoute) == "function"){
                failRoute();
            }
        }else{
            console.log(ModelName,funcName,"succesRoute");
            if(typeof(succesRoute) == "function"){
                succesRoute(data);
            }
            return data;
        }
    });
}

function add_pvd(query,succesRoute,failRoute,errRoute){
    var Model = this;
    var funcName = add_pvd.name;
    var ModelName = Model.modelName;
    var newModel = new Model();
    var data = [];
    for (var i=0;i<Object.keys(query).length;i++){
        var key = Object.keys(query)[i];
        newModel[key] = query[key];
    }
    newModel.save(function(err){
        if(err){
            console.log(funcName,"errRoute",err);
            if(typeof(errRoute) == "function"){
                errRoute();
            }
        }else{
            console.log(funcName,"succesRoute",ModelName,newModel);
            if(typeof(succesRoute) == "function"){
                data.push(newModel);
                succesRoute(data);
            }
        }
    });
}
function remove_pvd(query,succesRoute,failRoute,errRoute){
    var Model = this;
    var funcName = remove_pvd.name;
    var ModelName = Model.modelName;
    Model.remove(query, function(err, data){
        if(err){
            console.log(funcName,"errRoute",err);
            if(typeof(errRoute) == "function"){
                errRoute();
            }
        }else{
            console.log(funcName,"succesRoute",ModelName,":",query);
            if(typeof(succesRoute) == "function"){
                succesRoute();
            }
        }
    });
}
function set_pvd(tarQuery,setQuery,succesRoute,failRoute,errRoute){
    var Model = this;
    var funcName = set_pvd.name;
    var ModelName = Model.modelName;
    Model.update(tarQuery, {$set: setQuery},function(err, data){
        if(err){
            console.log(funcName,"errRoute",err);
            if(typeof(errRoute) == "function"){
                errRoute();
            }
        }else{
            console.log(funcName,"succesRoute",ModelName,":",tarQuery,"$set",setQuery);
            if(typeof(succesRoute) == "function"){
                succesRoute(data);
            }
        }
    });
}