
function STARTING(){
    var d = new $.Deferred;
    
    for (var tokens = 1 ; tokens <= tokensLeft ; tokens ++ ){
        var token_ID = "#token_ID" + String(tokens);
        if (tokens % 2 == 1 ){
            $(token_ID).prependTo("#PTH_PL1");
        }else{
            $(token_ID).prependTo("#PTH_PL2");
        }
    }
    
    putToken("E4","firstToken");
    putToken("D4","firstToken");
    putToken("D5","firstToken");
    putToken("E5","firstToken");

    d.resolve();//go next

    return d.promise();
}
    
function PLAYING(){
    var d = new $.Deferred;
//gameMessage("Do you PASS?","WIN");
    function TURN(){
        if ( whatGamestate != "ENDING" ){
            
            whoseTurn = turn[ (turnCount % 2)];
            turnCount ++;
            yourToken = (whoseTurn === "PL1" ) ? "black" : "white";
            oppoToken = (whoseTurn === "PL1" ) ? "white" : "black";
            console.log("turn:"+turnCount+" who?:"+whoseTurn+" yourtoken:"+yourToken)
            
            playableZoneCheck()
                .then(play)
                .then(flip)
                .then(endCheck)
                .then(TURN);
            
        }else{
            d.resolve();//go next 
        }
    }
    TURN();
        
    return d.promise();
}
    
function ENDING(){
    var d = new $.Deferred;

    var SeriesOfENDING = "howMany";
    var phaseTimer = 50;
    function timeSeriesENDING(){
        var id = setTimeout(timeSeriesENDING,phaseTimer);
        //console.log("test");
        switch (SeriesOfENDING){
            case "howMany":
                howManyTokensGet();
                SeriesOfENDING = "messageManage";
                console.log("SeriesOfENDING",SeriesOfENDING);
                break;
            case "messageManage":
                messageManage ();
                SeriesOfENDING = "withdrawTokens";
                phaseTimer = (Math.max(blackCount,whiteCount)*300);
                console.log("SeriesOfENDING",SeriesOfENDING);
                break;
            case "withdrawTokens":
                withdrawTokens();
                SeriesOfENDING = "gameMessage";
                console.log("SeriesOfENDING",SeriesOfENDING);
                break;
            case "gameMessage":
                gameMessage(endingMessage,"WIN");
                SeriesOfENDING = "";
                setTimeout(playSound("WIN"),1500);
                console.log("SeriesOfENDING",SeriesOfENDING);
                clearTimeout(id);
                break;                
        }

    }
    timeSeriesENDING();
    
    console.log("ENDING");
        
    d.resolve();//go next 

    return d.promise();
}

 