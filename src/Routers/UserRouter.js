const express = require("express")
const router = express.Router()
const UserAuth = require("../Middlewares/auth")
const ConnectionRequest = require("../Models/ConnectionRequest")
const User = require("../Models/Users")


router.get("/requests/received", UserAuth, async (req, res) => {
    try {
        let userId = req.User._id;
        let data = await ConnectionRequest.find({ toUserId: userId, status: "Interested" }).populate("fromUserId", "firstName lastName age gender photoUrl about skills").select("fromUserId toUserId")
        res.send(data)
    }
    catch (error) {
        res.send(error.message)
    }
})

router.get("/requests/connections", UserAuth, async (req, res) => {
    try {
        let loggedInUser = req.User._id;
        let data = await ConnectionRequest.find({ $or: [{ toUserId: loggedInUser, status: "Accepted" }, { fromUserId: loggedInUser, status: "Accepted" }] }).populate("fromUserId", "firstName lastName photoUrl age gender about").populate("toUserId", "firstName lastName photoUrl age gender about")
        
        //console.log(data)
        data = data.map(item => {
            if (item.fromUserId._id.toString() === loggedInUser.toString()) {
                return item.toUserId
            }
            return item.fromUserId


        })

       // console.log(data)
        res.json({ data, message: "success" })
    }
    catch (error) {
        res.send(error.message)
    }
})

module.exports = router