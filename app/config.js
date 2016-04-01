var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost/shortly');

module.exports.Schema = Schema;


var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB');
  // var kittySchema = mongoose.Schema({
  //   name: String
  // });
});

module.exports.connection = db;
