const express = require("express")
const router = express.Router();
const UserAuth = require("../Middlewares/auth");
const userAuth = require("../Middlewares/auth");
const ValidateUpdateUserData = require("../Utils/Validator").ValidateUpdateUserData
const User = require("../Models/Users")
const upload = require("../Middlewares/FileUpload")
const uploadOnCloudinary = require("../Utils/Cloudinary")



router.get("/view", UserAuth, async (req, res) => {
    let { firstName, lastName, gender, age, skills, theme, emailId, photoUrl, about } = req.User
    let userId = req.User._id
    res.json({ data: { firstName, lastName, gender, age, skills, theme, emailId, photoUrl, userId, about }, message: "success" })
})

router.patch("/update", UserAuth, upload.single("file"), async (req, res) => {
    try {
        ValidateUpdateUserData(req.body)
        //console.log(req.file)
        if (req.file) {
            let photoUrl = await uploadOnCloudinary(req.file.path)
            req.body.photoUrl = photoUrl
        }
        console.log(req.body)
        let updatedData = await User.findByIdAndUpdate(req.User._id.toString(), req.body, { returnDocument: "after" })


        const { firstName, lastName, about, gender, age, skills, _id, photoUrl, theme } = updatedData

         res.json({ data: { firstName, lastName, about, gender, age, skills, _id, photoUrl,theme }, message: "user updated" })
       // res.status(400).json({ message: "Oh my god Error" || 'An error occurred' });
    }
    catch (error) {
        console.log(error)
        res.status(400).send(error.message)
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