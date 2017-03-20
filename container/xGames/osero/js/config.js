
var thisFileName = "config.js"
console.log(thisFileName + " ok?");

var audioNames = ["puttingPen","fallSmall","fallMiddle","WIN","question"];
var audioFilePath = "../osero/audio/";

var viewPxWidth  = 400;
var viewPxHeight = 600;

//PROGRESS MANAGE VARIABLEs
var gamestate  = ["STARTING","RUNNING","ENDING"];
var turn       = ["PL1","PL2"];
var phase      = ["playableZoneCheck","play","flip","endCheck"];

//GAME VARIABLEs
var turnCount = 0;
var noPlayableSquare = false;
var tokensLeft = 64;
var tokensPlayed = 64 - tokensLeft;
var passRepeated = 0;
var maxTurn = 70;
var blackCount = 0;
var whiteCount = 0;

var setupedTokensCooBlack = ["E4","D5"];
var setupedTokensCooWhite = ["D4","E5"];

var whatGamestate = "";
var whoseTurn = "";
var whatPhase = "";
var yourToken = "";
var oppoToken = "";
var thisSQUARE = "";
var existPlayableSquare = false;
var uniqueClick = false;
var endingMessage = "";

var colAdjust = "";
var rowAdjust = "";
var nextCol = "";
var nextRow = "";
var nextSquareCoo = "";
var nextSQUARE = "";
var targetSquareCoo = "";
var existPlayableSquare = "";
var messageCacther = false;

var columns = [null,"A","B","C","D","E","F","G","H"];
var rows    = [null,"1","2","3","4","5","6","7","8"];
var SQUAREs = [];
for (var c=1;c<=8;c++){
    for (var r=1;r<=8;r++){
         SQUAREs[columns[c] + rows[r]] = {
            playable : null,
            onToken  : null,
            tokenID  : null
         }
    }
}


console.log( thisFileName +" done...");


