const express = require("express")
const router = express.Router();
const UserAuth = require("../Middlewares/auth");
const userAuth = require("../Middlewares/auth");
const ValidateUpdateUserData = require("../Utils/Validator").ValidateUpdateUserData
const User = require("../Models/Users")
const upload = require("../Middlewares/FileUpload")
const uploadOnCloudinary = require("../Utils/Cloudinary")
const {APIError} = require("../Utils/APIError")
const {APIResponse} = require("../Utils/APIResponse")


router.get("/view", UserAuth, async (req, res) => {
    try {


        let { firstName, lastName, gender, age, skills, theme, emailId, photoUrl, about } = req.User
        let userId = req.User._id

        res.status(200).json(new APIResponse(200, { firstName, lastName, gender, age, skills, theme, emailId, photoUrl, userId, about }, "User data fetched sucessfully"))
        //  res.json({ data: { firstName, lastName, gender, age, skills, theme, emailId, photoUrl, userId, about }, message: "success" })
    }
    catch(error)
    {
        res.status(500).json(new APIError(500, "Internal server error"))
    }
})

router.patch("/update", UserAuth, upload.single("file"), async (req, res) => {
    try {
        ValidateUpdateUserData(req.body)
        if (req.file) {
            let photoUrl = await uploadOnCloudinary(req.file.path)
            req.body.photoUrl = photoUrl
        }
        let updatedData = await User.findByIdAndUpdate(req.User._id.toString(), req.body, { returnDocument: "after" })
        const { firstName, lastName, about, gender, age, skills, _id, photoUrl, theme } = updatedData
        // res.json({ data: { firstName, lastName, about, gender, age, skills, _id, photoUrl, theme }, message: "user updated" })
        res.status(200).json(new APIResponse(200, { firstName, lastName, about, gender, age, skills, _id, photoUrl, theme }, "Profile updated successfully"));
    }
    catch (error) {
        //console.log(error)
        res.status(500).json(new APIError(500, "Internal server error"))
    }
})

router.patch("/updatePassword", userAuth, async (req, res) => {
    let id = req.query.id
    try {
        let newPassword = req.body.password;

        await User.findByIdAndUpdate(id, { password: newPassword },);
        res.send("user updated")
    }
    catch (error) {
        res.status(400).send(error.message)
    }

})

module.exports = router