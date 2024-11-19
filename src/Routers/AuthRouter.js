const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const User = require("../Models/Users")
const Validator = require("../Utils/Validator")
const userAuth = require("../Middlewares/auth")


router.post("/signup", async (req, res) => {
    try {
        let { firstName, lastName, emailId, password, gender, age, skills } = req.body
        let hashedPassword = await bcrypt.hash(password, 10)
        let user = new User({ firstName, lastName, emailId, password: hashedPassword, gender, age, skills })
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
            gender: data ?.gender,
            about:data?.about
        }


        res.json({ data: userDetails, message: "user inserted successfully" })
    } catch (error) {
        res.send(error.message)
    }
})


router.post("/login", async (req, res) => {
    try {
        let { emailId, password } = req.body
        if (Validator.emailValidator(emailId)) throw new Error("email is not valid")
        let user = await User.findOne({ emailId })
        if (!user) throw new Error("invalid credentials")
        let isValid = await user.isPasswordValid(password)
        if (!isValid) throw new Error("invalid credentials")
        let jwtToken = await user.getJwtToken(emailId)
        res.cookie("token", jwtToken, { maxAge: 10 * 60 * 60000 })
        res.json({
            data: {
                firstName: user.firstName,
                lastName: user.lastName,
                emailId: user.emailId,
                gender: user.gender,
                age: user.age,
                skills: user.skills,
                userId: user._id.toString(),
                theme: user.theme,
                about:user?.about
            }, message: "success"
        })
    }
    catch (error) {
        res.status(400).send(error.message)
    }

})

router.post("/logout", userAuth, async (req, res) => {
    try {
        let theme = req.body.theme
        let userId = req.User._id
        await User.findByIdAndUpdate(userId, { theme })
        res.cookie("token", "", { maxAge: 0 })
        res.json({ message: "success" })
    }
    catch (error) {
        res.status(400).send(error.message)
    }
})

module.exports = router