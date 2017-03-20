
function playableZoneCheck(){
    var d = new $.Deferred;
    existPlayableSquare = false;
    noPlayableSquare = false;
    
    for (var c=1;c<=8;c++){
        for(var r=1;r<=8;r++){
            targetSquareCoo = columns[c] + rows[r];
            thisSQUARE = SQUAREs[String(targetSquareCoo)];
            if (thisSQUARE.onToken){thisSQUARE.playable = false;};
            checkFlippableOrPlayable(c,r,"playable");
        }
    }
    
    //if playableZone is not exist, "noPlayableSquare" is on.
    if (!existPlayableSquare){ noPlayableSquare = true; };

    d.resolve();//go next 

    return d.promise();   
}

function play(){
    var d = new $.Deferred;
    uniqueClick = "PA";
    console.log(whoseTurn);
    //gameMessage(endingMessage,"WIN");
    $("#PS_" + whoseTurn + "_L").addClass("activePlayer");
    $("#PS_" + whoseTurn + "_R").addClass("activePlayer");
    $("#PA_" + whoseTurn).addClass("activePlayer").on("click",function(){
        if (uniqueClick != "PA") return;
        //$("#PI_" + whoseTurn).addClass("activePlayer");
        $("#PA_" + whoseTurn).removeClass("activePlayer");
        uniqueClick = "playableSquare";
        $(this).off("click");
        playSound("fallSmall");
        takeToken();
    });

    $(".playable").on("click",function(){
        if (uniqueClick != "playableSquare") return;
        $("#PI_" + whoseTurn).removeClass("activePlayer");
        $(".playerStatus").removeClass("activePlayer");
        uniqueClick = false;
        playSound("puttingPen");
        putToken(this.id);
        var c = cooDivide(this.id)[0];
        var r = cooDivide(this.id)[1];
        checkFlippableOrPlayable(c,r,"flippable");
        passRepeated = 0;
        d.resolve();//go next     
    })

    if (noPlayableSquare){
        playSound("question");
        
        gameMessage( yourToken.toUpperCase() + "\nPASS?");
        $("#PA_" + whoseTurn).removeClass("activePlayer").off("click");
        $(".playerStatus").removeClass("activePlayer");
        passRepeated ++;
        
        function PLkeyDown(){
            var id = setTimeout(PLkeyDown,500)
            if (messageCacther){
                d.resolve();//go next
                clearTimeout(id);
                messageCacther = false;
            }
            console.log("plkeydown");
        }
        PLkeyDown();
    }

    return d.promise();     
}

function flip(){
    var d = new $.Deferred;
    
    var flippingSide = "";
    switch (yourToken){
        case "black":
            flippingSide = "flipping_WtB";
            break;
        case "white":
            flippingSide = "flipping_BtW";
            break;
    }
    
    $(".flippable").removeClass("flippable").addClass(flippingSide)
        .addClass(yourToken + "_side").removeClass(oppoToken + "_side");
        
    setTimeout(function(){
        if(!noPlayableSquare){
            playSound("fallMiddle");
        }
        $("."+flippingSide).removeClass(flippingSide); 
        d.resolve();//go next 
    },500);

    return d.promise();     
}

function endCheck(){
    var d = new $.Deferred;

    $(".playable").off("click");
    clearPlayableClass();
    uniqueClick = false;
    
    console.log("endCheck");
    if (tokensLeft==0){
        whatGamestate = "ENDING";        
    }
    if(turnCount >= maxTurn){
        whatGamestate = "ENDING";
    }
    if(passRepeated >= 2){
        whatGamestate = "ENDING";    
    }
    d.resolve();//go next 

    return d.promise();     
}

