const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = () => {
    mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(()=>console.log("DB Connected Successfully"))
    .catch((error)=>{
        console.log("DB Connection Failed");
        console.error(error);
        process.exit(1);
    })
};

// useNewUrlParser: Set to true to use the new MongoDB connection string parser.
// useUnifiedTopology: Set to true to use the new Server Discovery and Monitoring engine.