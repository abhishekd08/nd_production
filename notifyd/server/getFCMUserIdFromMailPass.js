var getUserId = function(mail, pass) {
    var mysql = require('mysql');
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "sqlabhi08",
        database: "NotificationApp"
    });

    return new Promise(function(resolve, reject) {
        con.connect(function(err){ 
            if(err){
                console.log(err); 
                var res = {
                    "from":"registerUser",
                    "result":"fail",
                    "reason":"database error"
                };
                reject(JSON.stringify(res));
                // callback(JSON.stringify(res));
            }; 

            var sqlQuery = "select token from users where mail=? and pass=?;";
            con.query(sqlQuery, [mail, pass], function(err, rows) {
                if(err){
                    console.log(err);
                    var result = {
                        "from":"getUserId",
                        "result":"fail",
                        "reason":"database error"
                    }
                    reject(JSON.stringify(result));
                    // callback(JSON.stringify(result));
                }else{
                    if(rows.length && rows[0].token != null){
                        var result = {
                            "from":"getUserId",
                            "result":"success",
                            "token":rows[0].token
                        };
                        resolve(JSON.stringify(result));
                        // callback(JSON.stringify(result));
                    }else{
                        var result = {
                            "from":"getUserId",
                            "result":"fail",
                            "reason":"0 rows"
                        };
                        reject(JSON.stringify(result));
                        // callback(JSON.stringify(result));
                    }
                }
            });
            con.end();
        });
    });
}

module.exports = getUserId;