
const Course = require("../models/Course");
//const crypto = require("crypto");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const mongoose = require("mongoose");
const {
  courseEnrollmentEmail,
} = require("../mail/templates/courseEnrollmentEmail");
const {
  paymentSuccessEmail,
} = require("../mail/templates/paymentSuccessEmail");
const CourseProgress = require("../models/CourseProgress");
//import Stripe from "stripe";

const dotenv = require("dotenv");

dotenv.config();
const stripe = require("stripe")("sk_test_51PHJFQSCnOz0vYsuvUVbEqcqNndhho5TWB2bnmkVnoURAPVQXxb8FKuElFpnOrr0uCcIIbKnjuhx6afcjUhzwh7b00LQy4sSHK")
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY

exports.createCheckoutSession = async (req,res) =>{
  const {products} = req.body;
console.log(products);


    const lineItems = products.map((product)=>({
        price_data:{
            currency:"inr",
            product_data:{
                name:product.courseName,
                //images:[product.imgdata]
            },
            unit_amount:product.price * 100,
        },
        quantity:1
    }));

    const session = await stripe.checkout.sessions.create({
    payment_method_types:["card"],
        line_items:lineItems,
        mode:"payment",
        success_url:"http://localhost:3000/success",
        cancel_url:"http://localhost:3000/cancel",
    });

    res.json({id:session.id})
}



// exports.getCheckoutSession = async (req, res) => {
//   try {
//     const { courses } = req.body;
//     const userId = req.user.id;

//     const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//     const session = await stripe.checkout.sessions.create({
//         payment_method_types:['card'],
//         mode:'payment',
//         success_url:`${process.env.CLIENT_SITE_URL}/checkout-success`,
//         cancel_url: `${process.env.CLIENT_SITE_URL}/`,
//         customer_email:enrolledStudent.email,
//         client_reference_id: courses._id,
//         line_items:[
//             {
//                 price_data:{
//                     currency:'inr',
//                     unit_amount:  courses.price * 100,
//                     product_data:{
//                         name: Course.courseName,

//                     }
//                 },
//                 //quantity:1
//             }
//         ]

//     })

//     console.log(session)
//     // Find the student and add the course to their list of enrolled courses
//     const enrolledStudent = await User.findByIdAndUpdate(
//         userId,
//         {
//           $push: {
//             courses: courses._id,
//             courseProgress: CourseProgress._id,
//           },
//         },
//         session.id,
//         { new: true },
//       )

//       res.status(200).json({success:true,
//         message:"successfully paid",
//         session
//       })
    




//     // if (courses.length === 0) {
//     //   return res.json({ success: false, message: "Please Provide Course ID" });
//     // }

//     // let total_amount = 0;

//     // for (const course_id of courses) {
//     //   let course;
//     //   try {
//     //     // Find the course by its ID
//     //     course = await Course.findById(course_id);

//     //     // If the course is not found, return an error
//     //     if (!course) {
//     //       return res
//     //         .status(200)
//     //         .json({ success: false, message: "Could not find the Course" });
//     //     }

//     //     // Check if the user is already enrolled in the course
//     //     const uid = new mongoose.Types.ObjectId(userId);
//     //     if (course.studentsEnrolled.includes(uid)) {
//     //       return res
//     //         .status(200)
//     //         .json({ success: false, message: "Student is already Enrolled" });
//     //     }

//     //     // Add the price of the course to the total amount
//     //     total_amount += course.price;
//     //   } catch (error) {
//     //     console.log(error);
//     //     return res.status(500).json({ success: false, message: error.message });
//     //   }
//     // }

    
//   } catch (err) {
//     res.status(500).json({
//         success:false,
//         error:err.message,
//         message:"error creating checkout session"
//     });
    
//   }
// };

// const {instance} = require("../config/razorpay");//config tha isliye config me bnaye
// const Course = require("../models/Course");
// const User = require("../models/User");
// const mailSender = require("../utils/mailSender");
// const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail");
// const { default: mongoose } = require("mongoose");

// //capture the payment and initiate the Razorpay order
// exports.capturePayment = async (req,res) => {
//     //get courseId and UserID
//     const {course_id} = req.body;
//     const userId = req.user.id;
//     //validation
//     //valid courseID
//     if(!course_id) {
//         return res.json ({
//             success:false,
//             message:"Please provide valid course ID",
//         })
//     };
//     //valid courseDetail
//     let course;
//     try {
//         course = await Course.findById(course_id);
//         if(!course) {
//             return res.status(200).json({
//                 success: false,
//                 message:'Could not find the course',
//             });
//         }

//         //user already pay for the same course
//         const uid = new mongoose.Types.ObjectId(userId);//course me userid obj ke form me store hai and abhi userid hmare pass string type ki hai --> so convert userid into objid
//         if(course.studentsEnrolled.includes(uid)) {//phle se userid hai to nhi
//             return res.status(200).json({
//                 success:false,
//                 message:'Student is already enrolled',
//             })
//         }
//     }
//     catch(error) {
//         console.error(error);
//         return res.status(500).json({
//             success:false,
//             message: error.message,
//         });
//     }

//     //order create
//     const amount = course.price;
//     const currency = "INR";

//     const options = {
//         amount : amount * 100,
//         currency,
//         receipt: Math.random(Date.now()).toString(),
//         notes: {//additional data jo hm khud pass kiye
//             courseId: course_id,
//             userId,
//         }
//     };

//     try{
//         //initiate the payment using razorpay
//         const paymentResponse = await instance.orders.create(options);
//         console.log(paymentResponse);

//         //return response
//         return res.status(200).json({
//             success:true,
//             courseName:course.courseName,//coursename razorpay se thori aa rha hai ye course se aayega isliye course.coursename kiye
//             courseDescription: course.courseDescription,
//             thumbnail:course.thumbnail,
//             orderId: paymentResponse.id,
//             currency:paymentResponse.currency,
//             amount:paymentResponse.amount,
//         });
//     }
//     catch(error) {
//         console.log(error);
//         res.json({
//             success:false,
//             message:"Could not  initiate order",
//         });
//     }

// };

// //verify Signature of Razorpay and server

// exports.verifySignature = async (req,res) => {
//     const webhookSecret = "12345678";//server pr ye secret

//     const signature = req.headers("x-razorpay-signature");//razorpay jb api hit krega tb ye ye secret req ke header me with key as x-razorpay-signature dega

//     const shasum = crypto.createHmac("sha256" , webhookSecret);//this will give a hmac object using sha256-ALGORITHM and converting the secret key into hashed format
//     shasum.update(JSON.stringify(req.body));//converting the hmac object into string
//     const digest = shasum.digest("hex");//shasum ko hexadecimal me change kiye--webhooksecret ko digest me change kr diye

//     if(signature === digest) {
//         console.log("Payment is Authorised");//payment authorised ho gyi

//         const {courseId, userId} = req.body.payload.payment.entity.notes; //isliye ye courseid and userid hmlog notes me pass kiye because req abhi razorpay se aa rha hai backend se nhi

//         try {
//             //fulfill the action

//             //find the course and enroll the student in it
//             const enrolledCourse = await Course.findOneAndUpdate(
//                 {_id: courseId},
//                 {$push:{studentsEnrolled: userId}},
//                 {new:true},
//             );

//             if(!enrolledCourse) {
//                 return res.status(500).json({
//                     success:false,
//                     message:'Course not found',
//                 });
//             }

//             console.log(enrolledCourse);

//             //find the student and add the course to their list enrolled courses me
//             const enrolledStudent = await User.findOneAndUpdate(
//                 {_id:userId},
//                 {$push:{courses:courseId}},
//                 {new:true},
//             );

//             console.log(enrolledStudent);

//             //mail send krdo confirmation wala
//             const emailResponse = await mailSender(
//                 enrolledStudent.email,
//                 "Congratulations from CodeStudy",
//                 "Congratulations, you are onboared into new CodeStudy Course"
//             );

//             console.log(emailResponse);
//             return res.status(200).json({
//                 success:true,
//                 message:"Signature Verified and Course Added",
//             });

//         }
//         catch(error) {
//             console.log(error);
//             return res.status(500).json({
//                 success:false,
//                 message:error.message,
//             });

//         }
//     }

//     else {
//         return res.status(400).json({
//             success:false,
//             message: "Invalid request",
//         });
//     }
// };

// {/*
// const {instance} = require("../config/razorpay");
// const Course = require("../models/Course");
// const User = require("../models/User");
// const mailSender = require("../utils/mailSender");
// const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail");
// const {paymentSuccess} = require("../mail/templates/paymentSuccess");
// const { default: mongoose } = require("mongoose");
// const crypto = require("crypto");
// const CourseProgress = require("../models/CourseProgress");

// exports.capturePayment = async (req, res) => {
//     //get courseId and UserID
//     const {courses} = req.body;
//     const userId = req.user.id;
//     //validation
//     //valid courseID
//     try{
//     if(courses.length === 0) {
//         return res.json({
//             success:false,
//             message:'Please provide valid course ID',
//         })
//     };

//     let totalAmount = 0;

//     for(const course_id of courses){
//         let course;
//         // console.log("courseid=",course_id);
//         try{
//             course = await Course.findById(course_id);
//             if(!course) {
//                 return res.json({
//                     success:false,
//                     message:'Could not find the course',
//                 });
//             }

//             //user already pay for the same course
//             const uid = new mongoose.Types.ObjectId(userId);
//             if(course.studentsEnrolled.includes(uid)) {
//                 return res.status(200).json({
//                     success:false,
//                     message:'Student is already enrolled',
//                 });
//             }
//             totalAmount += course.price;
//         }
//         catch(error) {
//             console.error(error);
//             return res.status(500).json({
//                 success:false,
//                 message:error.message,
//             });
//         }
//         // totalAmount += course.price;
//     }
//         const options = {
//             amount: totalAmount * 100,
//             currency: "INR",
//             receipt: Math.random(Date.now()).toString(),
//         };

//         try{
//             //initiate the payment using razorpay
//             const paymentResponse = await instance.orders.create(options);
//             console.log("payment",paymentResponse);
//             //return response
//             return res.status(200).json({
//                 success:true,
//                 orderId: paymentResponse.id,
//                 currency:paymentResponse.currency,
//                 amount:paymentResponse.amount,
//             });
//         }
//         catch(error) {
//             console.error(error);
//             return res.status(500).json({
//                 success:false,
//                 message:error.message,
//             });
//         }
//     }
//     catch(error) {
//         console.error(error);
//         return res.status(500).json({
//             success:false,
//             message:error.message,
//         });
//     }

// };

//     //verify the signature
// exports.verifySignature = async (req, res) => {
//         //get the payment details
//         const {razorpay_payment_id, razorpay_order_id, razorpay_signature} = req.body;
//         const {courses} = req.body;
//         const userId = req.user.id;

//         if(!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
//             return res.status(400).json({
//                 success:false,
//                 message:'Payment details are incomplete',
//             });
//         }

//         let body = razorpay_order_id + "|" + razorpay_payment_id;

//         const enrolleStudent = async (courses, userId) => {
//             if(!courses || !userId) {
//                 return res.status(400).json({
//                     success:false,
//                     message:'Please provide valid courses and user ID',
//                 });
//             }
//                     try{
//                         //update the course
//                         for(const course_id of courses){
//                         console.log("verify courses=",course_id);
//                         const course = await Course.findByIdAndUpdate(
//                             course_id,
//                             {$push:{studentsEnrolled:userId}},
//                             {new:true}
//                         );
//                         //update the user
//                         const user = await User.updateOne(
//                             {_id:userId},
//                             {$push:{courses:course_id}},
//                             {new:true}
//                         );
//                         //set course progress
//                         const newCourseProgress = new CourseProgress({
//                             userID: userId,
//                             courseID: course_id,
//                           })
//                           await newCourseProgress.save()

//                           //add new course progress to user
//                           await User.findByIdAndUpdate(userId, {
//                             $push: { courseProgress: newCourseProgress._id },
//                           },{new:true});
//                         //send email
//                         const recipient = await User.findById(userId);
//                         console.log("recipient=>",course);
//                         const courseName = course.courseName;
//                         const courseDescription = course.courseDescription;
//                         const thumbnail = course.thumbnail;
//                         const userEmail = recipient.email;
//                         const userName = recipient.firstName + " " + recipient.lastName;
//                         const emailTemplate = courseEnrollmentEmail(courseName,userName, courseDescription, thumbnail);
//                         await mailSender(
//                             userEmail,
//                             `You have successfully enrolled for ${courseName}`,
//                             emailTemplate,
//                         );
//                         }
//                         return res.status(200).json({
//                             success:true,
//                             message:'Payment successful',
//                         });
//                     }
//                     catch(error) {
//                         console.error(error);
//                         return res.status(500).json({
//                             success:false,
//                             message:error.message,
//                         });
//                     }

//             }

//         try{
//             //verify the signature
//             const generatedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET).update(body.toString()).digest("hex");
//             if(generatedSignature === razorpay_signature) {
//                 await enrolleStudent(courses, userId);
//             }

//         }
//         catch(error) {
//             console.error(error);
//             return res.status(500).json({
//                 success:false,
//                 message:error.message,
//             });
//         }

//     }

// //send email

// exports.sendPaymentSuccessEmail = async (req, res) => {
//     const {amount,paymentId,orderId} = req.body;
//     const userId = req.user.id;
//     if(!amount || !paymentId) {
//         return res.status(400).json({
//             success:false,
//             message:'Please provide valid payment details',
//         });
//     }
//     try{
//         const enrolledStudent =  await User.findById(userId);
//         await mailSender(
//             enrolledStudent.email,
//             `Study Notion Payment successful`,
//             paymentSuccess(amount/100, paymentId, orderId, enrolledStudent.firstName, enrolledStudent.lastName),
//         );
// }
//     catch(error) {
//         console.error(error);
//         return res.status(500).json({
//             success:false,
//             message:error.message,
//         });
//     }
// }

// //capture the payment and initiate the Razorpay order
// // exports.capturePayment = async (req, res) => {
// //     //get courseId and UserID
// //     const {course_id} = req.body;
// //     const userId = req.user.id;
// //     //validation
// //     //valid courseID
// //     if(!course_id) {
// //         return res.json({
// //             success:false,
// //             message:'Please provide valid course ID',
// //         })
// //     };
// //     //valid courseDetail
// //     let course;
// //     try{
// //         course = await Course.findById(course_id);
// //         if(!course) {
// //             return res.json({
// //                 success:false,
// //                 message:'Could not find the course',
// //             });
// //         }

// //         //user already pay for the same course
// //         const uid = new mongoose.Types.ObjectId(userId);
// //         if(course.studentsEnrolled.includes(uid)) {
// //             return res.status(200).json({
// //                 success:false,
// //                 message:'Student is already enrolled',
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

// //     //order create
// //     const amount = course.price;
// //     const currency = "INR";

// //     const options = {
// //         amount: amount * 100,
// //         currency,
// //         receipt: Math.random(Date.now()).toString(),
// //         notes:{
// //             courseId: course_id,
// //             userId,
// //         }
// //     };

// //     try{
// //         //initiate the payment using razorpay
// //         const paymentResponse = await instance.orders.create(options);
// //         console.log(paymentResponse);
// //         //return response
// //         return res.status(200).json({
// //             success:true,
// //             courseName:course.courseName,
// //             courseDescription:course.courseDescription,
// //             thumbnail: course.thumbnail,
// //             orderId: paymentResponse.id,
// //             currency:paymentResponse.currency,
// //             amount:paymentResponse.amount,
// //         });
// //     }
// //     catch(error) {
// //         console.log(error);
// //         res.json({
// //             success:false,
// //             message:"Could not initiate order",
// //         });
// //     }

// // };

// // //verify Signature of Razorpay and Server

// // exports.verifySignature = async (req, res) => {
// //     const webhookSecret = "12345678";

// //     const signature = req.headers["x-razorpay-signature"];

// //     const shasum =  crypto.createHmac("sha256", webhookSecret);
// //     shasum.update(JSON.stringify(req.body));
// //     const digest = shasum.digest("hex");

// //     if(signature === digest) {
// //         console.log("Payment is Authorised");

// //         const {courseId, userId} = req.body.payload.payment.entity.notes;

// //         try{
// //                 //fulfil the action

// //                 //find the course and enroll the student in it
// //                 const enrolledCourse = await Course.findOneAndUpdate(
// //                                                 {_id: courseId},
// //                                                 {$push:{studentsEnrolled: userId}},
// //                                                 {new:true},
// //                 );

// //                 if(!enrolledCourse) {
// //                     return res.status(500).json({
// //                         success:false,
// //                         message:'Course not Found',
// //                     });
// //                 }

// //                 console.log(enrolledCourse);

// //                 //find the student andadd the course to their list enrolled courses me
// //                 const enrolledStudent = await User.findOneAndUpdate(
// //                                                 {_id:userId},
// //                                                 {$push:{courses:courseId}},
// //                                                 {new:true},
// //                 );

// //                 console.log(enrolledStudent);

// //                 //mail send krdo confirmation wala
// //                 const emailResponse = await mailSender(
// //                                         enrolledStudent.email,
// //                                         "Congratulations from CodeHelp",
// //                                         "Congratulations, you are onboarded into new CodeHelp Course",
// //                 );

// //                 console.log(emailResponse);
// //                 return res.status(200).json({
// //                     success:true,
// //                     message:"Signature Verified and COurse Added",
// //                 });

// //         }
// //         catch(error) {
// //             console.log(error);
// //             return res.status(500).json({
// //                 success:false,
// //                 message:error.message,
// //             });
// //         }
// //     }
// //     else {
// //         return res.status(400).json({
// //             success:false,
// //             message:'Invalid request',
// //         });
// //     }

// // };

// */}
