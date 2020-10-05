const mongoose = require('mongoose');
const Schema=mongoose.Schema;

const replySchema= new Schema({
    replyText: String,
    replyDeletePass: String,
    replyCreatedOn: Date,
    replyReported: Boolean
});

module.exports=replySchema;