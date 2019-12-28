function sendMsg(){
var notifyd = require('notifyd');
var datetime = new Date();
var promise = notifyd("abhi","abhi","server stopped !!!","node server stopped on ec2 ",""+datetime);

promise.then(function(result){
result = JSON.parse(result);
console.log(result);
},
function(err){
err = JSON.parse(err);
console.log(err);
}
);
}
sendMsg();
