/**
 * Created by Lazarus of Bethany on 05/05/2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var users = mongoose.Schema({
    name: String,
    mail:String,
    password: String
});
var User = mongoose.model('users', users);
module.exports = User;