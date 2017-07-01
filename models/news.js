/**
 * Created by Lazarus of Bethany on 23/06/2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var news = mongoose.Schema({
    title: String,
    body: String
});
var New = mongoose.model('news', news);
module.exports = New;