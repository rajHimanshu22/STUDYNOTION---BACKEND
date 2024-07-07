const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const emailTemplate = require("../mail/templates/emailVerificationTemplate");

const OTPSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:5*60,// The document will be automatically deleted after 5 minutes of its creation 
    },
});

//a function ->to send emails
async function sendVerificationEmail(email, otp) {//email aur otp dena hoga input me
    try{
        // Create a transporter to send emails

	    // Define the email options

	    // Send the email
        const mailResponse = await mailSender(email, "Verification Email from StudyNotion", emailTemplate(otp));//mailsender func in utils
        console.log("Email sent Successfully: ", mailResponse.response);
    }
    catch(error) {
        console.log("error occured while sending mails: ", error);
        throw error;
    }
}

// Define a post-save hook to send email after the document has been saved
OTPSchema.pre("save" , async function(next) {//document save hone se just phle ye code run hoga because pre save --,
    console.log("New document saved to database");
    
    // Only send an email when a new document is created
    if(this.isNew) {
       await sendVerificationEmail(this.email,this.otp);//this shows current object data
    }
    next();//ye krne ke baad next middleware pr chale jayege
});//save means save hone se just phle mail send kr denge

const OTP = mongoose.model("OTP", OTPSchema);

module.exports = OTP;


//module.exports = mongoose.model("OTP", OTPSchema);





//-----------------------------------------
//OTPSchema.pre("save" , async function(next)
// next pass the control to the next function in the middleware stack.//The argument, next, is a function that tells Express.js to 
//continue on to the following middleware you have configured for your application.