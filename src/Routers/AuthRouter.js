const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const User = require("../Models/Users")
const Validator = require("../Utils/Validator")
const userAuth = require("../Middlewares/auth")
const { APIError } = require("../Utils/APIError")
const { APIResponse } = require("../Utils/APIResponse")


router.post("/signup", async (req, res) => {
    try {
        let { firstName, lastName, emailId, password, gender, age, skills } = req.body
        let hashedPassword = await bcrypt.hash(password, 10)
        let user = new User({ firstName,lastName, emailId : emailId, password: hashedPassword, gender :gender, age, skills })
        let data = await user.save()
        let jwtToken = await user.getJwtToken(emailId)
        res.cookie("token", jwtToken, { maxAge: 10 * 60 * 60000 })
        let userDetails = {
            firstName: data.firstName,
            emailId: data.emailId,
            age: data.age,
            theme: data.theme,
            _id: data._id,
            lastName: data?.lastName,
            gender: data?.gender,
            about: data?.about
        }

        res.status(201).json(new APIResponse(200, userDetails, "User registered Successfully"))

    } catch (error) {

        res.status(500).json(new APIError(500, "Something went wrong while registering the user"))
    }
})


router.post("/login", async (req, res) => {
    try {
        let { emailId, password } = req.body
        if (Validator.emailValidator(emailId)) res.status(401).json(new APIError(401, "invalid credentials"))
        let user = await User.findOne({ emailId })

     
        if (!user) return res.status(401).json(new APIError(401, "User not found"))
  
        let isValid = await user.isPasswordValid(password)

        if (!isValid) return res.status(401).json(new APIError(401, "invalid credentials"))

        let jwtToken = await user.getJwtToken(emailId)

        res.cookie("token", jwtToken, { maxAge: 10 * 60 * 60000 })

        data = {
            firstName: user.firstName,
            lastName: user.lastName,
            emailId: user.emailId,
            gender: user.gender,
            age: user.age,
            skills: user.skills,
            userId: user._id.toString(),
            theme: user.theme,
            about: user?.about
        }
        res.status(200).json(new APIResponse(200, data, "User LoggedIn Successfully"))
    }
    catch (error) {

        res.status(500).json(new APIError(500, "internal server"))
    }

})

router.post("/logout", userAuth, async (req, res) => {
    try {
        let theme = req.body.theme
        let userId = req.User._id
        await User.findByIdAndUpdate(userId, { theme })
        res.cookie("token", "", { maxAge: 0 })
        //res.json({ message: "success" })
        res.status(200).json(new APIError(200, {}, "User Logged out successfully"))
    }
    catch (error) {

        res.status(500).json(APIError(500, "Internal Server Error"))
    }
})

module.exports = router