const express=require("express")
const router=express.Router()
const bcrypt=require("bcrypt")
const User=require("../Models/Users")
const Validator=require("../Utils/Validator")


router.post("/signup", async (req, res) => {
    try {

        let { firstName, lastName, emailId, password, gender, age, skills } = req.body
        let hashedPassword = await bcrypt.hash(password, 10)

        let user = new User({ firstName, lastName, emailId, password: hashedPassword, gender, age, skills })
        await user.save()
        res.send("data inserted")
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
        res.send("login success")
    }
    catch (error) {
        res.status(400).send(error.message)
    }

})

router.post("/logout", (req, res) => {

    res.cookie("token", "", { maxAge: 0 })
    res.send("user loggedout successfully")
})

module.exports=router