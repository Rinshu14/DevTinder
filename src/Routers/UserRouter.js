const express = require("express")
const router = express.Router()
const UserAuth = require("../Middlewares/auth")
const ConnectionRequest = require("../Models/ConnectionRequest")
const User = require("../Models/Users")
const { APIError } = require("../Utils/APIError")
const { APIResponse } = require("../Utils/APIResponse")


router.get("/requests/received", UserAuth, async (req, res) => {
    try {
        let userId = req.User._id;
        let data = await ConnectionRequest.find({ toUserId: userId, status: "interested" }).populate("fromUserId", "firstName lastName age gender photoUrl about skills").select("fromUserId toUserId")
        //res.send(data)
        res.status(201).json(new APIResponse(201,data,"Request is succesful"))
    }
    catch (error) {
        res.status(500).json(new APIError(500, "Something went wrong while registering the user"))
    }
})

router.get("/requests/connections", UserAuth, async (req, res) => {
    try {
        let loggedInUser = req.User._id;
        let data = await ConnectionRequest.find({ $or: [{ toUserId: loggedInUser, status: "accepted" }, { fromUserId: loggedInUser, status: "accepted" }] }).populate("fromUserId", "firstName lastName photoUrl age gender about").populate("toUserId", "firstName lastName photoUrl age gender about")

      
        data = data.map(item => {
            if (item.fromUserId._id.toString() === loggedInUser.toString()) {
                return item.toUserId
            }
            return item.fromUserId


        })

        // console.log(data)
        res.status(200).json(new APIResponse(200,data,  "success" ))
    }
    catch (error) {
        res.status(500).json(new APIError(500, "Something went wrong while registering the user"))
    }
})

module.exports = router