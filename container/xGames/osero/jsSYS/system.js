//System JS. its must be in common parts of All other games.I think.

function AUDIO(name){
    this.name = name;
    this.buffer = {};
    this.preload = false
}

var AUDIOs = new Object();
function createAUDIOs(){
    for (key in audioNames){
            var name = audioNames[key];
            AUDIOs[name] = new AUDIO(name);
    }
}

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
        AUDIOs[AUDIO].preload = true;
        preloadCheck --;
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
    $("#systemMessage").append('<div id="gameMessage"></>');
    $( "#gameMessage" ).append('<div id="btn">YES</>');
    $( "#gameMessage" ).append('<div id="btn2">NO</>');
    $( "#systemMessage" ).after('<div id="modal-overlay"></>');
    $("#modal-overlay").addClass("onModal");
    $( "#gameMessage" ).prepend(TEXT1);
    
    if(MODE == "WIN"){
        confetti(40);    
    }

    $("#btn").on("click",function(){
        $("#gameMessage").remove();
        $("#modal-overlay").remove();
        $(".confetti").remove();
        messageCacther =  true;
        d.resolve();//go next
    });

    return d.promise();
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
function viewPortHW(pxWH,MODE){
    var portraitWH,landscapeWH;
    $(window).bind("resize", function(){
	    if(Math.abs(window.orientation) === 0){
	    	if(/Android/.test(window.navigator.userAgent)){
	    		if(!portraitWH&&MODE=="width")portraitWH=$(window).width();
	    		if(!portraitWH&&MODE=="height")portraitWH=$(window).height();
	    	}else{
	    		if(MODE=="width")portraitWH=$(window).width();
	    		if(MODE=="height")portraitWH=$(window).height();
	    	}
	    	$("html").css("zoom" , portraitWH/pxWH);
	    }else{
	    	if(/Android/.test(window.navigator.userAgent)){
	    		if(!landscapeWH&&MODE=="width")landscapeWH=$(window).width();
	    		if(!landscapeWH&&MODE=="height")landscapeWH=$(window).height();
        	}else{
	    		if(MODE=="width")landscapeWH=$(window).width();
	    		if(MODE=="height")landscapeWH=$(window).height();
	    	}
	    	$("html").css("zoom" , landscapeWH/pxWH );
	    }
    }).trigger("resize");
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
var preloadCheck = false;
function KICKER(){
    var d = new $.Deferred;
    preventDoubleTap();
    viewPortHW(viewPxWidth,"width");
    audioContextCaller();
    createAUDIOs();
    
    for (var AUDIO in AUDIOs){
        audioSet(String(AUDIO));
        if(preloadCheck==false){
            preloadCheck = 1;
        }else{
            preloadCheck ++;
        }
    }
   
    timerID = setInterval(function(){
        if(preloadCheck == 0){
             d.resolve();//go next
             clearInterval(timerID);
             timerID = null;
         }
    }, 20); 
                      
    return d.promise();
}

function confetti(num){
    var confCount = num;
    for (i=1;i<=confCount;i++){
        console.log("confCount",i);
        var rgbPpt = ["rgb(255,0,0)","rgb(0,255,0)","rgb(0,0,255)","rgb(255,255,0)"];
        $("#systemMessage").after('<div class="confetti cnf' + i + '"/>');
        var topPx = -Math.random()*100-950;
        var leftpx = Math.random()*(viewPxWidth);//in viewPort changer ,$(window).width()
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
        function limitPx(target,limitMin,limitMax){
            if(target < limitMin){return limitMin};
            if(target > limitMax){return limitMax};
        }
        var moveLeftQuolity = limitPx(leftpx+(Math.random()*600-300),0,viewPxWidth-5);
        var movedLeft       = moveLeftQuolity+"px";
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

