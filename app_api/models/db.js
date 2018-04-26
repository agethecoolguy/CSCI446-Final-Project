var mongoose = require('mongoose');
var gracefulShutdown;

var dbURI = 'mongodb://localhost/Barter';

mongoose.connect(dbURI);

var readLine = require ("readline");
if (process.platform === "win64"){
  var rl = readLine.createInterface ({
    kinput: process.stdin,
    output: process.stdout
  });
  rl.on ("SIGINT", function (){
    process.emit ("SIGINT");
  });
}

mongoose.connection.on('connected', function () {
  console.log('Mongoose connected to ' + dbURI);
});
mongoose.connection.on('error', function(err) {
  console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', function(){
  console.log('Mongoose disconnected');
});

var gracefulShutdown = function(msg, callback) {
  mongoose.connection.close(function() {
    console.log('Mongoose disconnected through '+ msg);
    callback();    
  });
}
process.once('SIGUSR2', function() {
  gracefulShutdown('nodemon restart', function(){
    process.exit(0);
  });
});
process.on('SIGTERM', function(){
   gracefulShutdown('Heroku app shutdown', function() {
     process.exit(0);
   });
});
process.on('SIGINT', function(){
  gracefulShutdown('App recieved shutdown signal sigint', function(){
    process.exit(0);
  });
});
require('./schemas');