var saveNotification = function(mail, title, body, dateTime){
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
                    "from":"saveNotification",
                    "result":"fail",
                    "reason":"database error"
                };
                reject(JSON.stringify(res));
                // callback(JSON.stringify(res));
            }; 
        });
        
        var sqlQuery = "SELECT id FROM users WHERE mail=?;";
        con.query(sqlQuery, [mail], function(err, rows) {
            if(err){
                console.log(err); 
                var res = {
                    "from":"saveNotification",
                    "result":"fail",
                    "reason":"database error"
                };
                reject(JSON.stringify(res));
                con.end();
                // callback(JSON.stringify(res));
            }else{
                if(rows && rows.length){
                    var id = rows[0].id;
                    var sqlQuery2 = "INSERT INTO notifications (id, dateTime, title, body) values (?,?,?,?);";
                    con.query(sqlQuery2, [id, dateTime, title, body], function(err , rows2) {
                        if(err){
                            console.log(err); 
                            var res = {
                                "from":"saveNotification",
                                "result":"fail",
                                "reason":"database error"
                            };
                            reject(JSON.stringify(res));
                            // callback(JSON.stringify(res));
                        }else{
                            var res = {
                                "from":"saveNotification",
                                "result":"success"
                            };
                            resolve(JSON.stringify(res));
                            // callback(JSON.stringify(res));
                        }
                    });
                }else{
                    console.log(err); 
                        var res = {
                            "from":"saveNotification",
                            "result":"fail",
                            "reason":"database error"
                        };
                        reject(JSON.stringify(res));
                        // callback(JSON.stringify(res));
                }
                con.end();
            }
        });

    });
}

module.exports = saveNotification;