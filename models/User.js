const mongoose = require("mongoose");
  
const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true,
        trim: true,//Using trim will help in removing the white spaces present (beginning and ending of the string) in the string that you want to save to the DB
    },
    lastName:{
        type: String,
        required: true,
        trim: true,//Using trim will help in removing the white spaces present (beginning and ending of the string) in the string that you want to save to the DB
    },
    email:{
        type: String,
        required: true,
        trim:true,
    },
    password: {
        type: String,
        required: true,
    },
    accountType: {
        type:String,
        enum: ["Admin", "Student", "Instructor"],//yahi 3 type ke account ho skte so enum bnana is a good idea
        required:true,
    },
    active: {
        type: Boolean,
        default: true,
    },
    approved: {
        type: Boolean,
        default: true,
    },
    additionalDetails: {
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Profile",
    },
    courses: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Course",
        },
    ],
    image:{
        type:String,//url hoga isliye string
        required:true,
    },
    token: {
        type:String,
    },
    resetPasswordExpires: {
        type: Date,
    },
    courseProgress: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"CourseProgress",
        }
    ],
    // Add timestamps for when the document is created and last modified
},
{ timestamps: true }
);

module.exports = mongoose.model("user",userSchema);


//-----------------------------------
//trim:true
//---------------------------
//It's basically there to ensure the strings you save through the schema are properly trimmed. If you add { type: String, trim: true } to a field in your schema, then trying to save strings like "  hello", or "hello ", or "  hello ", would end up being saved as "hello" in Mongo - i.e. white spaces will be removed from both sides of the string.