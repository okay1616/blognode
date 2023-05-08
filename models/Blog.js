const mongoose = require('mongoose');
const { Schema } = mongoose;

const blogSchema = new Schema({
    author_id : {
        type : String,
        required : true
    },
    author_name: {
        type : String,
        required : true 
    },
    author_img :{
        type : String,
        required : true
    },
    author_desc : {
        type : String,
        required : true
    },
    title: {
        type: String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    content: {
        type: String,
        required:true
    },
    headerimglink : {
         type :String,
         required : true
    },
    category : {
        type : String,
        required : true
    },
    date : {
        type : Date,
        required : true,
    },
    likes : {
        type : Number,
        required : true
    },
    Views : {
        type : Number,
        required : true
    },
    comments : {
        type : [ {name:String,date:Date, comment : String}]
    },
    issues : {
        type : [ {name : String,date:Date,issue : String}]
    }
});
module.exports = mongoose.model("blog", blogSchema);