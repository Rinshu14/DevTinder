const express = require("express")
const router = express.Router();

const UserAuth = require("../Middlewares/auth");
const userAuth = require("../Middlewares/auth");
const ValidateUpdateUserData = require("../Utils/Validator").ValidateUpdateUserData
const User = require("../Models/Users")

// router.get("/view/:userId", UserAuth, async (req, res) => {

//     res.send(req.User)



// })

router.get("/view", UserAuth, async (req, res) => {

    res.send(req.User)



})

router.patch("/update", UserAuth, async (req, res) => {


    try {


        ValidateUpdateUserData(req.body)


        let data = await User.findByIdAndUpdate(req.User[0]._id.toString(), req.body, { returnDocument: "before" })
        console.log("update")
        res.json({ data, message: "user updated" })
    }
    catch (error) {

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