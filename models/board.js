const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const thread = require('./thread.js');

const boardSchema= new Schema({
    boardName: String,
    boardDeletePass: String,
    boardReported: Boolean,
    boardThreads: [thread]
});

module.exports=mongoose.model('board',boardSchema);