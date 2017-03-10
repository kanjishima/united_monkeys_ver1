exports.port = process.env.PORT;
exports.host = process.env.IP;

exports.sessionSecret = 'abesadao';
exports.sessionCookie = {
        httpOnly: false,
};

exports.db = {
    sessionNmae : "session",
    mainName    : "user",
    password    : "abehiroshi",
};
