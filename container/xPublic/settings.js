exports.port = process.env.PORT;
exports.host = process.env.IP;

exports.sessionSecret = 'abesadao';
exports.sessionCookie = {
        httpOnly: false,
};

exports.mongoUrl = 'mongodb://test:test@ds153667.mlab.com:53667/heroku_k2bprm7w';     //for heroku
//exports.mongoUrl = 'mongodb://test:test@ds127190.mlab.com:27190/umvo';                //for vartual lcal
//exports.mongoUrl = 'mongodb://'+process.env.IP+'/user';                               //for local