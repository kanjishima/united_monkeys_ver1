//System JS. its must be in common parts of All other games.I think.

var context;
function audioContextCaller(){
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    context = new AudioContext();
}

function getAudioBuffer(url, fn){  
  var req = new XMLHttpRequest();
  req.responseType = 'arraybuffer';
  req.onreadystatechange = function() {
    if (req.readyState === 4) {
      if (req.status === 0 || req.status === 200) {
        context.decodeAudioData(req.response, function(buffer) {
          fn(buffer);
        });
      }
    }
  };
  req.open('GET', url, true);
  req.send('');
};

function audioSet(AUDIO){
    getAudioBuffer( audioFilePath + AUDIO +".mp3", function(buffer) {
        AUDIOs[AUDIO].buffer = buffer;
    });
}
function playSound(audioName) {
  var buffer = AUDIOs[audioName].buffer
  var source = context.createBufferSource();
  source.buffer = buffer;
  source.connect(context.destination);
  source.start(0);
};


function gameMessage(TEXT1,MODE){
    var d = new $.Deferred;
    $( "#systemMessage" ).append('<div id="btn">YES</>');
    $( "#systemMessage" ).append('<div id="btn2">NO</>');
    $( "#systemMessage" )
    .after('<div id="modal-overlay"></>');    
    $("#modal-overlay")
    .css({
    	"z-index"           : "1",
	    "position"          : "fixed",
    	"top"               : "0",
    	"left"              : "0",
    	"width"             : "100%",
    	"height"            : "120%",
    	"background-color"  : "rgba(0,0,0,0.35)"
    }); 
    $( "#systemMessage" )
    .prepend(TEXT1)
    .css({
        "z-index"           : "2",
        "background"        : "white",
        "font-size"         : "40px",
        "width"             : "250px",
        "position"          : "relative",
        "top"               : "-420px",
        "left"              : "0px",
        "border-radius"     : "20px",
        "padding-top"       : "50px",
        "padding-bottom"    : "-10px",
        "border"            : "solid 10px #dddddd"
    });
    $("#btn").css({
        "z-index"           : "2",
        "background"        : "#ffffff",
        "color"             : "#dddddd",
        "font-size"         : "35px",
        "width"             : "80px",
        "height"            : "40px",
        "position"          : "relative",
        "top"               : "30px",
        "left"              : "10px",
        "border-radius"     : "10px",
        "padding"           : "10px",
        "border"            : "solid 3px #dddddd"
    }).mouseover(function(){$(this)
        .css({
        "color"             : "#111111",
        "border"            : "solid 3px #111111"
        })
    }).mouseout(function(){$(this)
        .css({
        "color"             : "#dddddd",
        "border"            : "solid 3px #dddddd"
        })
    }).on("click",function(){
        $("#systemMessage").html("");
        $("#systemMessage").removeAttr("style");
        $("#modal-overlay").remove();
        messageCacther =  true;
        d.resolve();//go next 
    });
    $("#btn2").css({
        "z-index"           : "2",
        "background"        : "#ffffff",
        "color"             : "#dddddd",
        "font-size"         : "35px",
        "width"             : "80px",
        "height"            : "40px",
        "position"          : "relative",
        "top"               : "-36px",
        "left"              : "134px",
        "border-radius"     : "10px",
        "padding"           : "10px",
        "border"            : "solid 3px #dddddd"
    //}).mouseover(function(){$(this)
    //    .css({
    //    "color"             : "#111111",
    //    "border"            : "solid 3px #111111"
    //    })
    //}).mouseout(function(){$(this)
    //    .css({
    //    "color"             : "#dddddd",
    //    "border"            : "solid 3px #dddddd"
    //    })
    });
    
    if(MODE == "WIN"){
        var confCount = 40;
        for (i=1;i<=confCount;i++){
            console.log("confCount",i);
            var rgbPpt = ["rgb(255,0,0)","rgb(0,255,0)","rgb(0,0,255)","rgb(255,255,0)"];
            $("#systemMessage").after('<div class="confetti cnf' + i + '"/>');
            var topPx = -Math.random()*100-950;
            var leftpx = Math.random()*($(window).width());
            var confSize = 15;
            $(".cnf"+i).css({
                "top"               : topPx+"px",
                "left"              : leftpx+"px",
                "background-color"  : rgbPpt[Math.round(Math.random()*4-1)]
            });
            $(".confetti").css({
                "z-index"           : "2",
                "position"          : "relative",
                "width"             : confSize + "px",
                "height"            : confSize + "px",
            });
            var movedTop        = topPx+300+"px";
            var movedLeft       = leftpx+(Math.random()*600-300)+"px";
            var movedRotation   = (Math.random()*360-180)+"deg";
            var movedScale      = "0.3";
            TweenMax.staggerTo(".cnf"+i, 1, {
                "top"               : movedTop,
                "left"              : movedLeft,
		        "opacity"           : "0.5",
		        "rotation"          : movedRotation,
		        "scale"             : movedScale,
		        "repeat"            : "true"
            }, 0.2 );
        }
    }

    return d.promise();
}

var messageMODEs = {
    "planeMSG":{
        "x"  : ""
    },
    "confirmMSG":{
        "OK" : ""
    },
    "ynMSG":{
        "YES": "",
        "NO" : ""
    }
}

function preventDoubleTap(){
    var tapFlag = false;
    var timer;
    document.body.addEventListener("touchstart", function(evt) {
        if (tapFlag) {
            evt.preventDefault();
        }
    }, true);
    document.body.addEventListener("touchend", function(evt) {
        tapFlag = true;
        clearTimeout(timer);
        timer = setTimeout(function() {
            tapFlag = false;
        }, 360); 
    }, true);
}

var clock8 = {
    "1:30" : { column :  1, row : -1},
    "3:00" : { column :  1, row :  0},    
    "4:30" : { column :  1, row :  1},
    "6:00" : { column :  0, row :  1},
    "7:30" : { column : -1, row :  1},
    "9:00" : { column : -1, row :  0},
    "10:30": { column : -1, row : -1},
    "12:00": { column :  0, row : -1},    
}

function KICKER(){
    var d = new $.Deferred;
    preventDoubleTap();
    audioContextCaller();
    for (var AUDIO in AUDIOs){
        audioSet(String(AUDIO));
    }
    d.resolve();//go next
    return d.promise();
}

