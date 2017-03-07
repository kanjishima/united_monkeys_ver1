

//create another include js

function clog(txt){
    console.log(txt);
}
function HelloFrom(){
    console.log("hello from AsyncRendere");
}
function makeHtml(array){
    var data = "";
    for (var i = 0;i < array.length;i++){
        if( typeofClass(array[i]) == "[object Array]" ){
            for (var j = 0;j < array[i].length;j++){ 
                data += array[i][j];
            } 
        }else{
            data += array[i];
        }
    }
    return data;
}
function typeofClass(obj){
    return Object.prototype.toString.call(obj);
}
function countObj(obj){
    return Object.keys(obj).length;
}
function masterKey(obj,Num){
    return obj[Object.keys(obj)[Num]];
}
