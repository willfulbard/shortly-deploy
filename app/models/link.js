var db = require('../config');
var mongoose = require('mongoose');
var crypto = require('crypto');

urlSchema = new mongoose.Schema({
  url: String,
  baseUrl: String,
  code: String,
  title: String,
  visits: Number
});


var Link = mongoose.model('Link', urlSchema);

urlSchema.pre('save', function(next) {
  var shasum = crypto.createHash('sha1');
  shasum.update(this.url);
  this.code = shasum.digest('hex').slice(0, 5);
});

module.exports = Link;
