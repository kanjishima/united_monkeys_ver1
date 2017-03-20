//games specified functions. its allmost called from PHASEs.js .

function nextSquareVariables(c,r,direction){
    colAdjust = clock8[direction].column;
    rowAdjust = clock8[direction].row;
    nextCol = c+colAdjust;
    nextRow = r+rowAdjust;
    nextSquareCoo = columns[nextCol] + rows[nextRow];
    nextSQUARE = SQUAREs[nextSquareCoo.toString()];
}

function necNextSquareVariables(){                
    nextCol += colAdjust;
    nextRow += rowAdjust;
    nextSquareCoo = columns[nextCol] + rows[nextRow];
    nextSQUARE = SQUAREs[nextSquareCoo.toString()];
}                            
 
function cooDivide(squareCoo){
    var c = Number(columns.indexOf(squareCoo.slice(0,1)));
    var r = Number(squareCoo.slice(1,2));
    return [c,r];
}

function addFlippableThisDirection(c,r,direction){
    nextSquareVariables(c,r,direction);
    var nextNon = false;
    while (nextSQUARE.onToken == oppoToken){
        nextSQUARE.onToken = yourToken;
        $("#token_ID" + nextSQUARE.tokenID).addClass("flippable");
        necNextSquareVariables();
        nextNon = true;
    }
}

function checkFlippableOrPlayable(c,r,MODE){
    for (var t in clock8){
        nextSquareVariables(c,r,t);
        var nextNon = false;
        var modeflag = true;
        if(thisSQUARE.playable!=null){
            if (MODE == "playable"){
                modeflag = false;
            }
        }
        if (nextSQUARE && !nextNon && modeflag){
            if (nextSQUARE.onToken == oppoToken){
                while (!nextNon && nextSQUARE.onToken ){
                    necNextSquareVariables();
                    if (nextSQUARE && !nextNon){
                        if(nextSQUARE.onToken == yourToken){
                            switch (MODE) {
                                case 'playable':
                                    thisSQUARE.playable = true;
                                    $("#" + targetSquareCoo).addClass("playable");
                                    existPlayableSquare = true;
                                    break;
                                case 'flippable':
                                    addFlippableThisDirection(c,r,t);
                                    break;
                                default:
                                    alert("MODE is not defined?");
                            }
                            nextNon = true;
                        }
                    }else{
                        nextNon = true;
                    }
                }
            }
        }else{
            nextNon = true;
        }
    }
}

function clearPlayableClass(){
    for ( c in columns){
        for( r in rows){
            if( columns[c] && rows[r] ){
                var clearSquareCoo = columns[c] + rows[r];
                $("#" + clearSquareCoo).removeClass("playable");
                SQUAREs[clearSquareCoo].playable = null;
            }
        }
    }
}

function takeToken(){
    var tokenID = 65 - tokensLeft;
    $("#token_ID"+tokenID).addClass("inHand");
}

function putToken(squareCoo,MODE){
    var tokenID = 65 - tokensLeft;
    switch (MODE){
        case "firstToken":
            var color = ( tokenID % 2 ) ? "black" : "white";
            break;
        default:
            var color = yourToken;
            break;
    }
    $("#token_ID"+tokenID).removeClass("inHand").removeClass("holding_side")
        .addClass(color+"_side").prependTo("#"+squareCoo);
    SQUAREs[squareCoo].onToken = color;
    SQUAREs[squareCoo].tokenID = tokenID;
    tokensLeft --;
}

function howManyTokensGet(){
    var d = new $.Deferred;
    //checkeachSQUARE
    //.countBlackToken,addblackTokenID
    //.countWhiteToken,addWhiteTokenID
    //.eachColorToken,inhandinOrder,slowly
    var c = 0;
    for (coo in SQUAREs){
        console.log(SQUAREs[coo].onToken);
        var onToken = SQUAREs[coo].onToken;
        var tokenID = SQUAREs[coo].tokenID;

        switch (onToken) {
            case 'black':
                blackCount ++;
                c++;
                $("#token_ID"+tokenID).addClass("black"+blackCount);
                //console.log($("#token_ID"+tokenID))
                break;
            case 'white':
                whiteCount ++;
                c++;
                $("#token_ID"+tokenID).addClass("white"+whiteCount);
                break;            
            default:
                c++;
        }
        if (c >=64){
            d.resolve();//go next 
            console.log("resolved");
            SeriesOfENDING = "messageManage";
        }
        console.log(c);
    }
    console.log("black"+blackCount+"white"+whiteCount);

    return d.promise();
};
function withdrawTokens(){
    var d = new $.Deferred;
    console.log("withdrawalTokens");
    
    var bl_wh_Count = 0;

    function withDraw(){
        var id = setTimeout(withDraw,300);
        playSound("puttingPen");
        if (bl_wh_Count <= blackCount){
            $(".black"+ bl_wh_Count).addClass("inHand");
            
        }
        if (bl_wh_Count <= whiteCount){
            $(".white"+ bl_wh_Count).addClass("inHand");
        }
        bl_wh_Count ++ ;
        if (bl_wh_Count <= blackCount){
            $(".black"+ bl_wh_Count).addClass("flipping_BtW");
        }
        if (bl_wh_Count <= whiteCount){
            $(".white"+ bl_wh_Count).addClass("flipping_WtB");
        }
        if(bl_wh_Count > Math.max(blackCount,whiteCount)){
            clearTimeout(id);
            d.resolve();//go next     
        }
    }
    withDraw();
    
    return d.promise();
}
function messageManage (){
    if (blackCount > whiteCount){
        endingMessage = "BLACK PLAYER WIN!!!";
    }else if(blackCount < whiteCount){
        endingMessage = "WHITE PLAYER WIN!!!";
    }else if(blackCount == whiteCount){
        endingMessage = "GAME is DRAW!!!"
    }
}    
