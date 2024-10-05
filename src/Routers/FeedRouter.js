const express = require("express")
const router = express.Router();
const ConnectionRequest = require("../Models/ConnectionRequest")
const UserAuth = require("../Middlewares/auth");
const User = require("../Models/Users")


router.get("/feed", UserAuth, async (req, res) => {
    try {

        let page = (parseInt(req.query.page) > 0) ? parseInt(req.query.page) : 1;
        let limit = (parseInt(req.query.limit) > 0) ? req.query.limit : 2;
        let skip = (page - 1) * limit
        let loggedInUser = req.User._id
        let data = await ConnectionRequest.find({ $or: [{ fromUserId: loggedInUser }, { toUserId: loggedInUser }] }).populate("fromUserId", "firstName status").populate("toUserId", "firstName").select("fromUserId toUserId")
        let set = new Set()
        data.map(item => {
            set.add(item.fromUserId._id)
            set.add(item.toUserId._id)
        })

        let users = await User.find({ _id: { $nin: Array.from(set) } }).select("firstName lastName gender age skills").skip(skip).limit(limit)



        res.json({ data: users, message: "success" })
    }
    catch (error) {
        res.send(error.message)
    }
})

module.exports = router
