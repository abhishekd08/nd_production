var sendNotification = function(token, mail, title, msg, dateTime){

    //TODO send dateTime in request body 
    // dateTime is not being used anywhere

    var http = require('http');
    var options = {
        host: "fcm.googleapis.com",
        port: "80",
        path: "/fcm/send",
        method: "POST",
        headers: {
            "Content-Type" : "application/json",
            "Authorization": "key=AAAA2affqcw:APA91bFsr7K25_dXOZOGFAvz4IuAi9gWEUDs6tLiskhpquw3EOS5eLliSdWfPjbUSMOUDsa-Q-L52Grdmu4XZh78D0eUEfKtt_JZqo1_FI5qGR4FDop3dKOyQaayzp-PbCvtDgErwxIS"
        }
    };
    var body = {
        "to":""+token,
        "notification":{
            "title":title,
            "body":msg
        },
        "data":{
            "datetime":dateTime
        }
    };

    return new Promise(function(resolve, reject) {
        var notifyRequest = http.request(options, function(res) {
    
            res.on('data', function(c) {
                c = JSON.parse(c);
                if(c.results[0].message_id){
                    var result = {
                        "from":"sendNotification",
                        "result":"success"
                    };
                    resolve(JSON.stringify(result));
                    //callback(JSON.stringify(result));
                }else{
                    var error = c.results[0].error;
                    var tempSendNotification = require('./tempSendNotification');
                    tempSendNotification("Some error in production !", ""+error);
                    
                    var result = {
                        "from":"sendNotification",
                        "result":"fail",
                        "reason":"FCM error !"
                    };
                    reject(JSON.stringify(result));
                    //callback(JSON.stringify(result));
                }
            });
        });
        notifyRequest.write(JSON.stringify(body));
        notifyRequest.end();
    });
}

module.exports = sendNotification;
