const cloudinary = require("cloudinary").v2;


exports.uploadImageToCloudinary = async (file, folder, height, quality) =>{
    const options = {folder};
    if(height) {
        options.height = height;
    }//height and quality se compress krna ho tb use kr skte hai
    if(quality) {
        options.quality = quality;
    }
    options.resource_type = "auto";
    //options ka pura object create kr liye

    return await cloudinary.uploader.upload(file.tempFilePath, options);
}