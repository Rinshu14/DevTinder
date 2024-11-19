const express = require("express")
const router = express.Router()
const UserAuth = require("../Middlewares/auth")
const ConnectionRequest = require("../Models/ConnectionRequest")
const User = require("../Models/Users")

router.post("/send/:status/:toUserId", UserAuth, async (req, res) => {
    try {
        let fromUserId = req.User._id.toString()
        let toUserId = req.params.toUserId
        let status = req.params.status
        let allowedStatus = ["Interested", "Ignored"]
        if (status && !allowedStatus.includes(status)) throw new Error("status should be Interested or Ignored")
        //check in db is touser exist
        let toUser = await User.findById(toUserId)
        if (!toUser) throw new Error("user not found for sending request")
        //check in DB is this request already exist or toUserId already sent request to fromUserId
        if (fromUserId === toUserId) throw new Error("user can not send connection request to himself ")
        let data = await ConnectionRequest.find({ $or: [{ fromUserId, toUserId }, { fromUserId: toUserId, toUserId: fromUserId }] })
       // console.log(data)
        if (data.length > 0) throw new Error("Already sent request")
        //toUser and fromUserId should not be equal
        let connectionRequest = new ConnectionRequest({ fromUserId, toUserId, status })
        await connectionRequest.save();
        

        res.json({
            status: "success",
            data: connectionRequest
        })
    }
    catch (error) {
        res.send(error.message)
    }
})

router.post("/review/:status/:requestId", UserAuth, async (req, res) => {
    try {
        let status = req.params.status
        let requestId = req.params.requestId
        let userId = req.User._id
        let allowedStatus = ["Accepted", "Rejected"]
        if (!allowedStatus.includes(status)) throw new Error("invalid status")
        let connectionRequest = await ConnectionRequest.find({ $and: [{ _id: requestId, status: "Interested", toUserId: userId }] })
        if (!connectionRequest) throw new Error("invalid request")
        let fromUser = await User.findById(connectionRequest[0].fromUserId)
        //console.log(fromUser)
        if (!fromUser) throw new Error("sender not found")
        let updatedRequest = await ConnectionRequest.findByIdAndUpdate(requestId, { status })
        res.json({ updatedRequest, message: `Request ${status} successfully` })
    }
    catch (error) {
        res.send(error.message)
    }
})

module.exports = router