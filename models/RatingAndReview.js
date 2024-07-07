const mongoose = require("mongoose");
  
const ratingAndReviewSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"user",
    },
    rating:{
        type:Number,
        required:true,
    },
    review:{
        type:String,
        required:true,
    },
    course : {
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Course",
        index:true,
    },

});

//export the ratingAndreview model
module.exports = mongoose.model("RatingAndReview",ratingAndReviewSchema);


//---------------------------------
//index:true
//Indexes are data structures that provide quick access to data in a database. They are similar to the index of a book, which allows you to quickly find information based on specific keywords.
//Indexes are an essential feature of databases that can significantly improve query performance.
//Indexes support the efficient execution of queries in MongoDB. Without indexes, MongoDB must perform a collection scan, i.e. scan every document in a collection, to select those documents that match the query statement. If an appropriate index exists for a query, MongoDB can use the index to limit the number of documents it must inspect.