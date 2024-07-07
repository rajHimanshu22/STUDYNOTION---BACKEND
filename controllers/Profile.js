// const Profile = require("../models/Profile");
// const CourseProgress = require("../models/CourseProgress");
// const Course = require("../models/Course");
// const User = require("../models/User");
// const { uploadImageToCloudinary } = require("../utils/imageUploader");
// const mongoose = require("mongoose");

//const {instance} = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail");
//const {paymentSuccess} = require("../mail/templates/paymentSuccess");
const { default: mongoose } = require("mongoose");
const crypto = require("crypto");
const CourseProgress = require("../models/CourseProgress");


// // exports.capturePayment = async (req, res) => {
// //     //get courseId and UserID
// //     const {courses} = req.body;
// //     const userId = req.user.id;
// //     //validation
// //     //valid courseID
// //     try{
// //     if(courses.length === 0) {
// //         return res.json({
// //             success:false,
// //             message:'Please provide valid course ID',
// //         })
// //     };

// //     let totalAmount = 0;

// //     for(const course_id of courses){
// //         let course;
// //         // console.log("courseid=",course_id);
// //         try{
// //             course = await Course.findById(course_id);
// //             if(!course) {
// //                 return res.json({
// //                     success:false,
// //                     message:'Could not find the course',
// //                 });
// //             }
    
// //             //user already pay for the same course
// //             const uid = new mongoose.Types.ObjectId(userId);
// //             if(course.studentsEnrolled.includes(uid)) {
// //                 return res.status(200).json({
// //                     success:false,
// //                     message:'Student is already enrolled',
// //                 });
// //             }
// //             totalAmount += course.price;
// //         }
// //         catch(error) {
// //             console.error(error);
// //             return res.status(500).json({
// //                 success:false,
// //                 message:error.message,
// //             });
// //         }
// //         // totalAmount += course.price;
// //     }
// //         const options = {
// //             amount: totalAmount * 100,
// //             currency: "INR",
// //             receipt: Math.random(Date.now()).toString(),
// //         };

// //         try{
// //             //initiate the payment using razorpay
// //             const paymentResponse = await instance.orders.create(options);
// //             console.log("payment",paymentResponse);
// //             //return response
// //             return res.status(200).json({
// //                 success:true,
// //                 orderId: paymentResponse.id,
// //                 currency:paymentResponse.currency,
// //                 amount:paymentResponse.amount,
// //             });
// //         }
// //         catch(error) {
// //             console.error(error);
// //             return res.status(500).json({
// //                 success:false,
// //                 message:error.message,
// //             });
// //         }
// //     }
// //     catch(error) {
// //         console.error(error);
// //         return res.status(500).json({
// //             success:false,
// //             message:error.message,
// //         });
// //     }
    
// // };



// //     //verify the signature
// // exports.verifySignature = async (req, res) => {
// //         //get the payment details
// //         const {razorpay_payment_id, razorpay_order_id, razorpay_signature} = req.body;
// //         const {courses} = req.body;
// //         const userId = req.user.id;


// //         if(!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
// //             return res.status(400).json({
// //                 success:false,
// //                 message:'Payment details are incomplete',
// //             });
// //         }

// //         let body = razorpay_order_id + "|" + razorpay_payment_id;

// //         const enrolleStudent = async (courses, userId) => {
// //             if(!courses || !userId) {
// //                 return res.status(400).json({
// //                     success:false,
// //                     message:'Please provide valid courses and user ID',
// //                 });
// //             }
// //                     try{
// //                         //update the course
// //                         for(const course_id of courses){
// //                         console.log("verify courses=",course_id);
// //                         const course = await Course.findByIdAndUpdate(
// //                             course_id,
// //                             {$push:{studentsEnrolled:userId}},
// //                             {new:true}
// //                         );
// //                         //update the user
// //                         const user = await User.updateOne(
// //                             {_id:userId},
// //                             {$push:{courses:course_id}},
// //                             {new:true}
// //                         );
// //                         //set course progress
// //                         const newCourseProgress = new CourseProgress({
// //                             userID: userId,
// //                             courseID: course_id,
// //                           })
// //                           await newCourseProgress.save()
                    
// //                           //add new course progress to user
// //                           await User.findByIdAndUpdate(userId, {
// //                             $push: { courseProgress: newCourseProgress._id },
// //                           },{new:true});
// //                         //send email
// //                         const recipient = await User.findById(userId);
// //                         console.log("recipient=>",course);
// //                         const courseName = course.courseName;
// //                         const courseDescription = course.courseDescription;
// //                         const thumbnail = course.thumbnail;
// //                         const userEmail = recipient.email;
// //                         const userName = recipient.firstName + " " + recipient.lastName;
// //                         const emailTemplate = courseEnrollmentEmail(courseName,userName, courseDescription, thumbnail);
// //                         await mailSender(
// //                             userEmail,
// //                             `You have successfully enrolled for ${courseName}`,
// //                             emailTemplate,
// //                         );
// //                         }
// //                         return res.status(200).json({
// //                             success:true,
// //                             message:'Payment successful',
// //                         });
// //                     }
// //                     catch(error) {
// //                         console.error(error);
// //                         return res.status(500).json({
// //                             success:false,
// //                             message:error.message,
// //                         });
// //                     }
                
// //             }

// //         try{
// //             //verify the signature
// //             const generatedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET).update(body.toString()).digest("hex");
// //             if(generatedSignature === razorpay_signature) {
// //                 await enrolleStudent(courses, userId);
// //             }

// //         }
// //         catch(error) {
// //             console.error(error);
// //             return res.status(500).json({
// //                 success:false,
// //                 message:error.message,
// //             });
// //         }

     
// //     }




// // //send email

// // exports.sendPaymentSuccessEmail = async (req, res) => {
// //     const {amount,paymentId,orderId} = req.body;
// //     const userId = req.user.id;
// //     if(!amount || !paymentId) {
// //         return res.status(400).json({
// //             success:false,
// //             message:'Please provide valid payment details',
// //         });
// //     }
// //     try{
// //         const enrolledStudent =  await User.findById(userId);
// //         await mailSender(
// //             enrolledStudent.email,
// //             `Study Notion Payment successful`,
// //             paymentSuccess(amount/100, paymentId, orderId, enrolledStudent.firstName, enrolledStudent.lastName),
// //         );
// // }
// //     catch(error) {
// //         console.error(error);
// //         return res.status(500).json({
// //             success:false,
// //             message:error.message,
// //         });
// //     }
// // }




exports.updateProfile = async(req,res) => {
    try {
        //get data
        const {dateOfBirth="",about= "", contactNumber, firstName,lastName ,gender }=req.body;//dob and about mandatory nhi hai isliye aise likhe
        //get userId --ye isliye laye because if we have to do something in userschema
        const id = req.user.id;//auth middleware me id likhe
        //validation
        if(!contactNumber || !gender || !id) {
            return res.status(400).json({
                success:false,
                message:'All fields are required',
            });
        }
        
        //find profile--koi profile id to ni hai abhi --but user id hai aur user ke ander profile id hai
        const userDetails = await User.findById(id);
        const profile = await Profile.findById(userDetails.additionalDetails);
        // const profileId = userDetails.additionalDetails; //ye id return krega because ref to profile hai
        // const profileDetails = await Profile.findById(profileId);
        
        //update profile
        userDetails.firstName = firstName || userDetails.firstName;
		userDetails.lastName = lastName || userDetails.lastName;
        profile.dateOfBirth = dateOfBirth || profile.dateOfBirth;
        profile.about = about || profile.about;
        profile.gender = gender || profile.gender;
        profile.contactNumber= contactNumber || profile.contactNumber;
        await profile.save();
        await userDetails.save();

        //aise likhne se kya DB me update ho gya - yes because object to phle se bna hai (none jisme bahr kr bnaye the user me) and we have to just update the value

        //const updatedProfile = await Profile.findByIdAndUpdate(profileId, )-- ye object bnane ki need nhi hai
        //return response
        return res.status(200).json({
            success:true,
            message:'Profile Updated Successfully',
            profile,
            //userDetails
        })
    }
    catch (error) {
        return res.status(500).json({
            success:false,
            error:error.message,
        });
    }
}

//deleteAccount
//Explore --> how can we schedule this deletion operation

exports.deleteAccount = async(req,res)=>{
    try{
        //get id: id layege tb to delete krege
        //id nikal lege because user logged in hai- id delete krne ke liye login krega hi
        const id = req.user.id;
        console.log(id)
        //validation
        const user = await User.findById(id);
        if(!user) {
            return res.status(404).json ({
                success:false,
                message:'User not found',
            });
        }
        //delete profile-before deleting user delete additional details first
        await Profile.findByIdAndDelete({_id:user.additionalDetails});
        //TODO: HW unenroll user from all enrolled courses mtlb no.of stu count bhi decrease hoga
        // for (const courseId of user.courses) {
        //     await Course.findByIdAndUpdate(
        //       courseId,
        //       { $pull: { studentsEnroled: id } },
        //       { new: true }
        //     )
        //   }
        //delete user--profile delete kr diye to uss user ko bhi delete kr dege
        await User.findByIdAndDelete({_id:id});

        //return response
        return res.status(200).json({
            success:true,
            message:'User Deleted Successfully',
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:'User cannot be deleted successfully',
        });
    }
}

exports.getAllUserDetails = async(req,res) => {
    try {
        //get id
        const id = req.user.id;
        //validation and get user details
        const userDetails = await User.findById(id).populate("additionalDetails").exec();//find by id se bs user milega but usme jo additional details sb hai wo nhi milega because uske jagah pr id hai so uske liye populate ka use krege
        console.log(userDetails)
        //return response
        return res.status(200).json({
            success:true,
            message:'User Data Fetched Successully',//yaha return kr skte response me userdetails
            data: userDetails,
        });
    }
    catch(error) {
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}


//-----

exports.updateDisplayPicture = async (req, res) => {
    try {
      const displayPicture = req.files.displayPicture;
      const userId = req.user.id;
      const image = await uploadImageToCloudinary(
        displayPicture,
        process.env.FOLDER_NAME,
        1000,
        1000
      )
      console.log(image)
      const updatedProfile = await User.findByIdAndUpdate(
        { _id: userId },
        { image: image.secure_url },
        { new: true }
      )
      res.send({
        success: true,
        message: `Image Updated successfully`,
        data: updatedProfile,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }
  
  exports.getEnrolledCourses = async (req, res) => {
    try {
      const userId = req.user.id
      let userDetails = await User.findOne({
        _id: userId,
      })
        .populate({
          path: "courses",
          populate: {
            path: "courseContent",
            populate: {
              path: "subSection",
            },
          },
        })
        .exec()
      userDetails = userDetails.toObject()
      var SubsectionLength = 0
      for (var i = 0; i < userDetails.courses.length; i++) {
        let totalDurationInSeconds = 0
        SubsectionLength = 0
        for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
          totalDurationInSeconds += userDetails.courses[i].courseContent[
            j
          ].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
          userDetails.courses[i].totalDuration = convertSecondsToDuration(
            totalDurationInSeconds
          )
          SubsectionLength +=
            userDetails.courses[i].courseContent[j].subSection.length
        }
        let courseProgressCount = await CourseProgress.findOne({
          courseID: userDetails.courses[i]._id,
          userId: userId,
        })
        courseProgressCount = courseProgressCount?.completedVideos.length
        if (SubsectionLength === 0) {
          userDetails.courses[i].progressPercentage = 100
        } else {
          // To make it up to 2 decimal point
          const multiplier = Math.pow(10, 2)
          userDetails.courses[i].progressPercentage =
            Math.round(
              (courseProgressCount / SubsectionLength) * 100 * multiplier
            ) / multiplier
        }
      }
  
      if (!userDetails) {
        return res.status(400).json({
          success: false,
          message: `Could not find user with id: ${userDetails}`,
        })
      }
      return res.status(200).json({
        success: true,
        data: userDetails.courses,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }
  
  // exports.instructorDashboard = async (req, res) => {
  //   try {
  //     const courseDetails = await Course.find({ instructor: req.user.id }) // instructor ki id se
  
  //     const courseData = courseDetails.map((course) => {
  //       const totalStudentsEnrolled = course.studentsEnroled.length
  //       const totalAmountGenerated = totalStudentsEnrolled * course.price
  
  //       // Create a new object with the additional fields
  //       const courseDataWithStats = {
  //         _id: course._id,
  //         courseName: course.courseName,
  //         courseDescription: course.courseDescription,
  //         // Include other course properties as needed
  //         totalStudentsEnrolled,
  //         totalAmountGenerated,
  //       }
  
  //       return courseDataWithStats
  //     })
  
  //     res.status(200).json({ courses: courseData })
  //   } catch (error) {
  //     console.error(error)
  //     res.status(500).json({ message: "Server Error" })
  //   }
  // }

  //instructor dashboard
exports.instructorDashboard = async (req, res) => {
	try {
		const id = req.user.id;
		const courseData = await Course.find({instructor:id});
		const courseDetails = courseData.map((course) => {
			totalStudents = course?.studentsEnrolled?.length;
			totalRevenue = course?.price * totalStudents;
			const courseStats = {
				_id: course._id,
				courseName: course.courseName,
				courseDescription: course.courseDescription,
				totalStudents,
				totalRevenue,
			};
			return courseStats;
		});
		res.status(200).json({
			success: true,
			message: "User Data fetched successfully",
			data: courseDetails,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
}