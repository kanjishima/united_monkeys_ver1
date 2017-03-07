//
//
//

//when view accept "someData", "someData" shold be Object, and should have below structure.
/* 
var someData = {
    "someModelAsName" : {
        //DataContens mongooseBasedData
    },
    "someModelAsName" : {
        //DataContens mongooseBasedData
    },
    //........repeat
}
*/
// but mongooseDataContens is vadivdated by String or Array ( only Becaouse "typeofClass" case setted "Array",)
//this method shoul have AllRound dataType and AllLevelDepth.(THis version suports 2Level and Array .)
/*
<div id= tarObjName _id>
    <div id= property >
        <label> property :</label>
        <partition>:</partition>
        <interior> Contens </interior>
    </div>
    <div id= property >
        <label> property :</label>
        <interior>
            <div id= tarObjName _id>
                <label> property :</label>
                <partition>:</partition>
                <interior> Contens </interior>
            </div> 
        </interior>
    </div>
</div>
*/
//
//asyncRender_Auto,   asyncRender_Cunstom,
function asyncRender(data,objectName){
    
    var htmlNode = "";

    if(objectName){
        tarObjectWrapper(objectName);
    }else{
        eachObjectProcces();
    }
    
    function eachObjectProcces(){
        for (var i in data){
            tarObjectWrapper(i);
        }
    }
    function tarObjectWrapper(tarObjName){
        var targetObject = data[tarObjName];
        if(typeofClass(targetObject) == '[object String]'){
            htmlNode += '<div class='+tarObjName+'>';
            htmlNode += '<label>'+tarObjName+'</label>';
            htmlNode += '<partition>:</partition>';
            htmlNode += '<interior>'+targetObject+'</interior>';
            htmlNode += '</div>';
        }else{
            for(var i in targetObject){
                htmlNode += '<div class="'+tarObjName+'" id="'+targetObject[i]._id+'">';
                for (var j in targetObject[i]){
                    if(typeofClass(targetObject[i][j]) == "[object Object]"){
                        //clog(targetObject[i][j]);
                        //tarObjectWrapper(j,targetObject[i][j]);
                    }else if(typeofClass(targetObject[i][j]) == "[object Array]"){
                        tarArrayWrapper(j,targetObject[i][j]);
                    }else if(! j.match(/^\_/) ){
                        htmlNode += '<div class="'+j +'">';
                        htmlNode += '<label>'+j+'</label>';
                        htmlNode += '<partition>:</partition>';
                        htmlNode += '<interior>'+targetObject[i][j]+'</interior>';
                        htmlNode += '</div>';
                    }
                }
                htmlNode += '</div>';
            }
        }
    }
    function tarArrayWrapper(tarArrayName,tarArray){
        htmlNode += '<div class="'+ tarArrayName +'">';
        htmlNode += '<label>'+tarArrayName+'</label>';
        htmlNode += '<partition>:</partition>';
        htmlNode += '<interior>';
        htmlNode += '<ul>';
        for (var i=0;i<tarArray.length;i++){
            htmlNode += '<div class="'+tarArrayName+'_'+i +'">'
            htmlNode += '<label>'+tarArrayName+'_'+i +'</label>';
            htmlNode += '<partition>:</partition>';
            htmlNode += '<interior>'+tarArray[i]+'</interior>'
            htmlNode += '</div>';
        }
        htmlNode += '</ul>';
        htmlNode += '</interior>';
        htmlNode += '</div>';
    }
    
    return htmlNode;
}



//secret option shold have models ,because this method reveal all of modelsproperty . so, secret option prevent this method.



