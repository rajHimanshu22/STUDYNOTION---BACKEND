const express = require("express");
const app = express();

const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payments");
const courseRoutes =  require("./routes/Course");

const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors"); // frontend and backend alag alag ports pr run ho rhe hai isliye cross origin cors ko enable kr diye
const {cloudinaryConnect} = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");

dotenv.config();
const PORT = process.env.PORT || 5000;

//database connect
database.connect();

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use (
    cors()
)

app.use(
    fileUpload({
        useTempFiles:true,
        tempFileDir:"/tmp",
    })
)

//cloudinary connection
cloudinaryConnect();



//routes
app.use("/api/v1/auth",userRoutes);
app.use("/api/v1/profile",profileRoutes);
app.use("/api/v1/course",courseRoutes);
app.use("/api/v1/payment",paymentRoutes)


//default route

app.get("/", (req,res) => {
    return res.status(200).json({
        success:true,
        message:'Your server is up and running....',
    });
});

app.listen(PORT , () => {
    console.log(`App is running at ${PORT}`)
})

