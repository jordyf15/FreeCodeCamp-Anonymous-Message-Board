const mongoose=require('mongoose');
const reply = require('./reply.js');
const Schema= mongoose.Schema;

const threadSchema= new Schema({
    threadText: String,
    threadDeletePass: String,
    threadCreatedOn: Date,
    threadBumpedOn: Date,
    threadReported: Boolean,
    threadReplyCount: Number,
    threadReplies: [reply]
});

module.exports=threadSchema;