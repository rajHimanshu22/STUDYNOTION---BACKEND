const Section = require("../models/Section");
const Course = require("../models/Course");
const SubSection = require("../models/SubSection");
// CREATE a new section
exports.createSection = async (req, res) => {
	try {
		// Extract the required properties from the request body
		const { sectionName, courseId } = req.body;

		// Validate the input
		if (!sectionName || !courseId) {
			return res.status(400).json({
				success: false,
				message: "Missing required properties",
			});
		}

		// Create a new section with the given name
		const newSection = await Section.create({ sectionName });

		// Add the new section to the course's content array
		const updatedCourse = await Course.findByIdAndUpdate(
			courseId,
			{
				$push: {
					courseContent: newSection._id,
				},
			},
			{ new: true }
		)
			.populate({
				path: "courseContent",
				populate: {
					path: "subSection",
				},
			})
			.exec();

		// Return the updated course object in the response
		res.status(200).json({
			success: true,
			message: "Section created successfully",
			updatedCourse,
		});
	} catch (error) {
		// Handle errors
		res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message,
		});
	}
};

// UPDATE a section
exports.updateSection = async (req, res) => {
	try {
		const { sectionName, sectionId,courseId } = req.body;
		const section = await Section.findByIdAndUpdate(
			sectionId,
			{ sectionName },
			{ new: true }
		);

		const course = await Course.findById(courseId)
		.populate({
			path:"courseContent",
			populate:{
				path:"subSection",
			},
		})
		.exec();

		res.status(200).json({
			success: true,
			message: section,
			data:course,
		});
	} catch (error) {
		console.error("Error updating section:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};

// DELETE a section
exports.deleteSection = async (req, res) => {
	try {

		const { sectionId, courseId }  = req.body;
		await Course.findByIdAndUpdate(courseId, {
			$pull: {
				courseContent: sectionId,
			}
		})
		const section = await Section.findById(sectionId);
		console.log(sectionId, courseId);
		if(!section) {
			return res.status(404).json({
				success:false,
				message:"Section not Found",
			})
		}

		//delete sub section
		await SubSection.deleteMany({_id: {$in: section.subSection}});

		await Section.findByIdAndDelete(sectionId);

		//find the updated course and return 
		const course = await Course.findById(courseId).populate({
			path:"courseContent",
			populate: {
				path: "subSection"
			}
		})
		.exec();

		res.status(200).json({
			success:true,
			message:"Section deleted",
			data:course
		});
	} catch (error) {
		console.error("Error deleting section:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};   




// const Section = require("../models/Section");
// const Course = require("../models/Course");
// const SubSection = require("../models/SubSection");

// exports.createSection = async (req,res) => {
//     try {
//         //data fetch
//         const {sectionName, courseId} = req.body;
//         //data validation
//         if(!sectionName || !courseId) {
//             return res.status(400).json ({
//                 success:false,
//                 message:'Missing  Properties',
//             });
//         }
//         //create section
//         const newSection = await Section.create({sectionName});
//         //update course with section ObjectID
//         const updatedCourse = await Course.findByIdAndUpdate(
//             courseId,
//             {
//                 $push: {
//                     courseContent: newSection._id,
//                 }
//             },
//             {new:true},
//         ).populate({
//             path: "courseContent",
//             populate: {
//                 path: "subSection",
//             },
//         })
//         .exec();
//         //HW: Use populate to replace sections/sub-sections both in the updatedCourseDetails
//         //return response
//         return res.status(200).json ({
//             success:true,
//             message:'Section created successfully',
//             updatedCourse,
//         });
//     }
//     catch (error) {
//         return res.status(500).json({
//             success:false,
//             message:"Unable to create Section try again",
//             error:error.message,
//         });
//     }
// }

// //update a section

// exports.updateSection = async (req,res)=>{
//     try {

//         //data input
//         const {sectionName, sectionId,courseId } = req.body;
//         console.log(sectionName, sectionId);
//         //data validation
//         if(!sectionName|| !sectionId) {
//             return res.status(400).json({
//                 success:false,
//                 message:'Missing Properties',
//             });
//         }

//         //update data
//         const section = await Section.findByIdAndUpdate(sectionId, {sectionName},{new:true});

//         const updatedCourse = await Course.findById(courseId)
// 		.populate({
// 			path:"courseContent",
// 			populate:{
// 				path:"subSection",
// 			},
// 		})
// 		.exec();

//         //return res
//         return res.status(200).json ({
//             success:true,
//             message:'Section Updated Successfully',
//             message: section,
// 			data:updatedCourse,
//         });
//     }
//     catch (error) {
//         console.error("Error updating section:", error);
//         return res.status(500).json({
//             success:false,
//             message:"Unable to update Section try again",
//             error:error.message,
//         });
//     }
// }

// //delete section
// exports.deleteSection = async (req, res) => {
// 	try {

// 		const { sectionId, courseId }  = req.body;
// 		await Course.findByIdAndUpdate(courseId, {
// 			$pull: {
// 				courseContent: sectionId,
// 			}
// 		})
// 		const section = await Section.findById(sectionId);
// 		console.log(sectionId, courseId);
// 		if(!section) {
// 			return res.status(404).json({
// 				success:false,
// 				message:"Section not Found",
// 			})
// 		}

// 		//delete sub section
// 		await SubSection.deleteMany({_id: {$in: section.subSection}});

// 		await Section.findByIdAndDelete(sectionId);

// 		//find the updated course and return 
// 		const course = await Course.findById(courseId).populate({
// 			path:"courseContent",
// 			populate: {
// 				path: "subSection"
// 			}
// 		})
// 		.exec();

// 		res.status(200).json({
// 			success:true,
// 			message:"Section deleted",
// 			data:course
// 		});
// 	} catch (error) {
// 		console.error("Error deleting section:", error);
// 		res.status(500).json({
// 			success: false,
// 			message: "Internal server error",
// 		});
// 	}
// };   


// // exports.deleteSection = async (req , res) => {
// //     try {
// //         //get ID - delete krne ke liye bs id chahiye sirf id se search krke delete kr dege
// //         //get ID - assuming that we are sending ID in params (in routes)
// //         const {sectionId, courseId} = req.params
// //         await Course.findByIdAndUpdate(courseId, {
// // 			$pull: {
// // 				courseContent: sectionId,
// // 			}
// // 		})
// //         //use findByIdAndDelete
// //         await Section.findByIdAndDelete(sectionId);
// //         //TODO[TESTING]: do we need to delete the entry from the course schema ??
// //         const updatedCourse = await Course.findById(courseId).populate({
// // 			path:"courseContent",
// // 			populate: {
// // 				path: "subSection"
// // 			}
// // 		})
// // 		.exec();
// //         //return response
// //         return res.status(200).json({
// //             success:true,
// //             message:"Section Deleted Successfully",
// //             updatedCourse
// //         })
// //     }
// //     catch (error) {
// //         return res.status(500).json({
// //             success:false,
// //             message:"Unable to delete Section, please try again",
// //             error:error.message,
// //         });
// //     }
// // }