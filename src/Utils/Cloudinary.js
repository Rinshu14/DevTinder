
const cloudinary = require('cloudinary').v2;
const fs = require("fs")


cloudinary.config({
    cloud_name: "devtinder",
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})


const uploadOnCloudinary = async (localFilePath) => {
    try {

   
        //check if file exist
        if (!localFilePath) return null;
        //upload file on cloudinary
        let result = await cloudinary.uploader.upload(localFilePath, { resource_type: "image" })
        
 //remove file from server
        fs.unlinkSync(localFilePath)

        return result.url
    }
    catch (err) {
        console.log(err)
        //remove file from server
        fs.unlinkSync(localFilePath)
    }
}

module.exports = uploadOnCloudinary
