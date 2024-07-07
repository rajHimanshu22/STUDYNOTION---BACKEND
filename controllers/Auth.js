const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/mailSender")
const { passwordUpdated } = require("../mail/templates/passwordUpdate")
const Profile = require("../models/Profile")
require("dotenv").config();


//signUp
exports.signup = async (req, res) => {
  try {
    //data fetch from request ki body
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;

    //validate krlo
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      //think on otp here--pre save se otp aa chuka hoga User.create se phle //contact no. optional hai and acc type to select krega hi 1 koi to uska to 1 value milega hi
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }
    //2 password match krlo--password and confirm password
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Password and ConfirmPassword Value does not match, please try again",
      });
    }

    //check user already exist or not
    const existingUser = await User.findOne({ email }); //email ke basis pr db me search kiye
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User is already registered",
      });
    }

    //find most recent OTP stored for the user
    const response = await OTP.find({ email })
      .sort({ createdAt: -1 })
      .limit(1); //You can use mongo query sort() to get that. It can take value 1 or -1 according to sorting order,;//The limit() method in Mongoose is used to specify the number or a maximum number of documents to return from a query.
    console.log(response);

    //validate OTP
    if (response.length == 0) {
      //OTP not found
      return res.status(400).json({
        success: false,
        message: "OTP not Found",
      });
    } else if (otp !== response[0].otp) {
      //otp=generated otp above
      //Invalid OTP
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    //Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //entry create in DB--USER me additional details hai jisme contact no. PROFILE me hai so phle profile bnana hoga before entering into USER db
    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });

    const user = await User.create({
      firstName,
      lastName,
      email,
      contactNumber,
      password: hashedPassword,
      accountType,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`, //this dicebear api will generate profile images using first char of first and last name
    });
    //return res
    return res.status(200).json({
      success: true,
      message: "User is registered Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "User cannot be registered. Please try again",
    });
  }
};

//Login
exports.login = async(req,res) =>{
    try{
        //get data from req body
        const {email,password} = req.body;
        //validation data
        if(!email || !password){
            return res.status(403).json({
                success:false,
                message:'All fields are required, please try again',
            });
        }
        //user check exist or not
        const user = await User.findOne({email}).populate("additionalDetails");//additional details bhi aa gya populate krane se pura data aa gya user ka
        if(!user) {
            return res.status(401).json({
                success:false,
                message:"User is not registered, please signup first",
            });
        }
        //generate JWT , after password matching
        if(await bcrypt.compare(password, user.password)) {//bcrypt: A library to help you hash passwords.//bcrypt ke compare func se compare the password with hashed password stored in db
            const payload = {
                email: user.email,
                id: user._id,
                accountType:user.accountType,
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET, {//jwt ke sign func se token create hota hai
                expiresIn:"24h",
            });
            user.token = token;
            user.password = undefined;//cookie me pass krne se phle undefined kr diye password ko db me undefined nhi kiye hai user jo variable bnaye jisme email ki basis pr entry laye hai usme undefined kiye

            //create cookie and send response
            const options ={
                expires:new Date(Date.now() + 30*24*60*60*1000),
                httpOnly:true,
            } 
            res.cookie("token", token, options).status(200).json({
                success:true,
                token,
                user,
                message:'Logged in successful',
            })
        }
        else {
            return res.status(401).json({
                success:false,
                message:'Password is incorrect',
            });
        }
        
    }
    catch (error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Login Failure, please  try again',
        })
    }
};

//sendOTP jb tk otp send nhi hoga tb tk sign up nhi hoga
exports.sendotp = async (req, res) => {
  try {
    //fetch email from request ki body
    const { email } = req.body;

    //check if user already exist
    const checkUserPresent = await User.findOne({ email });

    //if user already exist , then return a response
    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User already registered",
      });
    }

    //generate otp
    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    console.log("OTP generated: ", otp);

    //check unique otp or not
    let result = await OTP.findOne({ otp: otp });

    console.log("Result is Generate OTP Func");
		console.log("OTP", otp);
		console.log("Result", result);

    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await OTP.findOne({ otp: otp });
    }

    //entry of the otp in DB
    const otpPayload = { email, otp };

    //create an entry for OTP
    const otpBody = await OTP.create(otpPayload);
    console.log("OTP Body", otpBody);

    //return response successful
    res.status(200).json({
      success: true,
      message: "OTP Sent Successfully",
      otp,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


//changePassword
//TODO: HOMEWORK
exports.changePassword = async (Req,res) =>{
    // Controller for Changing Password
exports.changePassword = async (req, res) => {
  try {
    // Get user data from req.user
    const userDetails = await User.findById(req.user.id)

    // Get old password, new password, and confirm new password from req.body
    const { oldPassword, newPassword } = req.body

    // Validate old password
    const isPasswordMatch = await bcrypt.compare(
      oldPassword,
      userDetails.password
    )
    if (!isPasswordMatch) {
      // If old password does not match, return a 401 (Unauthorized) error
      return res
        .status(401)
        .json({ success: false, message: "The password is incorrect" })
    }

    // Update password
    const encryptedPassword = await bcrypt.hash(newPassword, 10)
    const updatedUserDetails = await User.findByIdAndUpdate(
      req.user.id,
      { password: encryptedPassword },
      { new: true }
    )

    // Send notification email
    try {
      const emailResponse = await mailSender(
        updatedUserDetails.email,
        "Password for your account has been updated",
        passwordUpdated(
          updatedUserDetails.email,
          `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
        )
      )
      console.log("Email sent successfully:", emailResponse.response)
    } catch (error) {
      // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
      console.error("Error occurred while sending email:", error)
      return res.status(500).json({
        success: false,
        message: "Error occurred while sending email",
        error: error.message,
      })
    }

    // Return success response
    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully" })
  } catch (error) {
    // If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
    console.error("Error occurred while updating password:", error)
    return res.status(500).json({
      success: false,
      message: "Error occurred while updating password",
      error: error.message,
    })
  }
}
  
  
  //get data from req body
    //get oldPassword, newPassword, confirmNewPassword
    //validation

    //update pwd in DB
    //send mail = Password updated
    //return response
}

//-----------------------------------------------------------------------------------

//   const recentOtp = await OTP.find({email}).sort({createdAt:-1}).limit(1);
//--------------------------------------------------------------------------------
//You can use mongo query sort() to get that. It can take value 1 or -1 according to sorting order,

//The limit() method in Mongoose is used to specify the number or a maximum number of documents to return from a query.
//You can use mongo query sort() to get that. It can take value 1 or -1 according to sorting order,
//Sorting by descending order
// const posts = await Post.find().sort({ createdAt: -1 })

//Sorting by ascending order
// const posts = await Post.find().sort({ createdAt: 1 })

// it is similar to the following:  { date: 'desc' } {date: 'descending'}
//-------------------------------------------------------------------------------------
