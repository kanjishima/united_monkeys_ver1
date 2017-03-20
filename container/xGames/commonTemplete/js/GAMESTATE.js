
function STARTING(){
    var d = new $.Deferred;
 
    d.resolve();//go next
    
    return d.promise();
}
    
function PLAYING(){
    var d = new $.Deferred;
    gameMessage("ok ???","WIN");
    setTimeout(function(){
        gameMessage("ok ???");
        console.log("ok")
        
    },5000);
    d.resolve();//go next    
    return d.promise();
}
    
function ENDING(){
    var d = new $.Deferred;

    d.resolve();//go next 

    return d.promise();
}

 