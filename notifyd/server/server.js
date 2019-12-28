const express = require('express');
const body_parser = require('body-parser');

var app = express();
var jsonparser = body_parser.json();

const simpleLogger = require('simple-node-logger'),
    opts = {
        logFilePath:'server_logs.log',
        timestampFormat:'YYYY-MM-DD HH:mm:ss.SSS'
    },
log = simpleLogger.createSimpleLogger(opts);

// Node API

app.post('/sendNotification', jsonparser, function(req, res) {
    
    var mail = req.body.mail;
    var pass = req.body.pass;
    var title = req.body.title;
    var body = req.body.body;
    var datetime = req.body.datetime;

    log.info("sendNotification","\nuser : ",mail,"\npass : ",pass,"\ntitle : ",title,"\nbody : ",body,"\ndatetime : ",datetime);

    sendNotificationAsync(mail, pass, title, body, datetime, function(result) {
        result = JSON.parse(result);
        log.info("sendNotification Result : ",result.result," for ",mail,"\n",result);
        res.end(JSON.stringify(result));
    });
});

function sendNotificationAsync(mail, pass, title, body, datetime, callback){
    var getFcmToken = require('./getFCMUserIdFromMailPass');

    var promise1 = getFcmToken(mail, pass);
    promise1.then(function(response1) {

        var token;
        Promise.resolve(response1 = JSON.parse(response1))
            .then(console.log(token = response1.token));

        var sendNotification = require('./sendNotification');
        var promise2 = sendNotification(token, mail, title, body, datetime);

        promise2.then(function(response2) {

            var saveNotification = require('./saveNotification');
            var promise3 = saveNotification(mail, title, body, datetime);

            promise3.then(function(response3) {
                var final_response = {
                    "result":"success"
                }
                callback(JSON.stringify(final_response));

            }, function(err) {
                var final_response = {
                    "result":"fail",
                    "reason":"saveNotificationError"
                };
                callback(JSON.stringify(final_response));
            });

        }, function(err) {
            err = JSON.parse(err);
            var final_response = {
                "result":"fail",
                "reason":"sendNotificationError",
                "error":err.reason
            }
            callback(JSON.stringify(final_response));
        });

    }, function(err) {
        var final_response = {
            "result":"fail",
            "reason":"tokenError"
        };
        callback(JSON.stringify(final_response));
    });
}

// Mobile API 

app.post('/getAllNotifications', jsonparser, function(req,res) {
    
    var mail = req.body.mail;
    var pass = req.body.pass;

    log.info("getAllNotifications","\nuser : ",mail,"\npass : ",pass);

    var getAllNotifications = require('./getAllNotifications');
    getAllNotifications(mail, pass, function(response) {
        response = JSON.parse(response);
        log.info("getAllNotifications Result : ",response.result," for ",mail);
        res.end(JSON.stringify(response));
    });
});

app.post("/updateToken",jsonparser, function(req,res) {
    
    var mail = req.body.mail;
    var pass = req.body.pass;
    var token = req.body.token;

    log.info("updateToken","\nuser : "+mail,"\npass : ",pass,"\ntoken : ",token);

    var updateToken = require('./updateToken');
    updateToken(mail, pass, token, function(response) {
        response = JSON.parse(response);
        log.info("updateToken Result : ",response.result," for ",mail);
        res.end(JSON.stringify(response));
    });
});

app.post("/deleteNotification", jsonparser, function(req, res) {
    var mail = req.body.mail;
    var title = req.body.title;
    var body = req.body.body;
    var datetime = req.body.datetime;

    log.info("updateToken","\ntitle : "+title,"\nbody : ",body,"\ndatetime : ",datetime);

    var deleteNotification = require('./deleteNotification');
    deleteNotification(title, body, datetime, function(response) {
        response = JSON.parse(response);
        log.info("deleteNotification Result : ",response.result," for ",mail);
        res.end(JSON.stringify(response));
    });
});

app.post("/signIn", jsonparser, function(req, res) {

    var mail = req.body.mail;
    var pass = req.body.pass;
    var token = req.body.token;

    log.info("signIn","\nuser : "+mail,"\npass : ",pass,"\ntoken : ",token);

    var signIn = require('./signIn');
    signIn(mail, pass, token, function(response) {
        response = JSON.parse(response);
        log.info("signIn Result : ",response.result," for ",mail);
        res.end(JSON.stringify(response));
    });
});

app.post('/registerUser', jsonparser, function(req,res) {
    
    var mail = req.body.mail;
    var pass = req.body.pass;
    var token = req.body.token;

    log.info("registerUser","\nuser : "+mail,"\npass : ",pass,"\ntoken : ",token);
    
    var registerUser = require('./registerUser');
    registerUser(mail, pass, token, function(response) {
        response = JSON.parse(response);
        log.info("registerUser Result : ",response.result," for ",mail);
        res.end(JSON.stringify(response));
    });
});

app.listen(4545)
