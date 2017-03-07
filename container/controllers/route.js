//
//this file descrive "rooting contents dataHandling"
//
var async = require("async");
var model = require('.././models/model.js');
var User  = model.User;
var LoginUsers  = model.LoginUsers; 
var GameTable  = model.GameTable; 


exports.loginCheck = function(req, res, next) {
    if(req.session.user){
      next();
    }else{
      res.render("login.ejs");
    }
};
exports.root = function(req,res){
    console.log("root");
    var query ={
        user : req.session.user,
    };
    res.render('home.ejs', query);
};
exports.add = function(req, res){
    console.log("add");
    var query = { 
        "name"     : req.body.name,
        "password"  : req.body.password
    };
    var errRoute    = function(){res.redirect("back");};
    var succesRoute = function(){res.redirect("/login");};
    User.add_pvd(query,errRoute,"",succesRoute);
};
exports.login = function(req, res){
    console.log("login");
    var query = { 
        "name"     : req.query.name,
        "password"  : req.query.password
    };
    var errRoute    = function(){res.redirect("");};
    var failRoute   = function(){res.render("login.ejs");};
    var succesRoute = function(){
        req.session.user = query.name;
        User.set_pvd(query,{"logStatus":"login"});
        res.redirect("/");
    };
    User.find_pvd(query,errRoute,failRoute,succesRoute);
};
exports.logout = function(req,res){
    console.log("logout");    
    console.log('deleted session');
    var query = {
        "name" : req.session.user,
    };
    req.session.destroy();
    var errRoute    = function(){res.redirect("/");};
    var failRoute   = function(){res.redirect("/");};
    var succesRoute = function(data){
        LoginUsers.remove_pvd(query);
        User.set_pvd(query,{"logStatus":"logout"});
        console.log(data);
        res.redirect("/login");
    };
    LoginUsers.find_pvd(query,errRoute,failRoute,succesRoute);
};

