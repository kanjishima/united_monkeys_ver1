function goNext(next){
    return function(result){ next(null,result); } ;
};
module.exports = goNext;