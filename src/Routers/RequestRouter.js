const express = require("express")
const router = express.Router()
const UserAuth = require("../Middlewares/auth")
const ConnectionRequest = require("../Models/ConnectionRequest")
const User = require("../Models/Users")
const {APIError} = require("../Utils/APIError")
const {APIResponse} = require("../Utils/APIResponse")

router.post("/send/:status/:toUserId", UserAuth, async (req, res) => {
    try {
        let fromUserId = req.User._id.toString()
        let toUserId = req.params.toUserId
        let status = req.params.status
        let allowedStatus = ["interested", "ignored"]
        if (status && !allowedStatus.includes(status)) res.status(400).json(new APIError("status should be Interested or Ignored",400))
        //check in db is touser exist
        let toUser = await User.findById(toUserId)
        if (!toUser) res.status(400).json(new APIError("user not found for sending request",400))
        //check in DB is this request already exist or toUserId already sent request to fromUserId
        if (fromUserId === toUserId) res.status(400).json(new APIError("user can not send connection request to himself ",400))
        let data = await ConnectionRequest.find({ $or: [{ fromUserId, toUserId }, { fromUserId: toUserId, toUserId: fromUserId }] })
       // console.log(data)
        if (data.length > 0) res.status(400).json(new APIError(400,"Already sent request"))
        //toUser and fromUserId should not be equal
        let connectionRequest = new ConnectionRequest({ fromUserId, toUserId, status })
        await connectionRequest.save();
        

        // res.json({
        //     status: "success",
        //     data: connectionRequest
        // })

        res.status(201).json(new APIResponse(201,connectionRequest))
    }
    catch (error) {
        res.status(500).json(new APIError(500, "Something went wrong while registering the user"))
       // res.stzatus()
    }
})

router.post("/review/:status/:requestId", UserAuth, async (req, res) => {
    try {
        let status = req.params.status
        let requestId = req.params.requestId
        let userId = req.User._id
        let allowedStatus = ["accepted", "rejected"]
        if (!allowedStatus.includes(status)) res.status(400).json(new APIError("invalid status",400))
        let connectionRequest = await ConnectionRequest.find({ $and: [{ _id: requestId, status: "interested", toUserId: userId }] })
        if (!connectionRequest) res.status(400).json(new APIError("invalid request",400))
        let fromUser = await User.findById(connectionRequest[0].fromUserId)
        
        if (!fromUser) res.status(400).json(new APIError("sender not found"),400)
        let updatedRequest = await ConnectionRequest.findByIdAndUpdate(requestId, { status })
console.log(updatedRequest)
        res.status(201).json(new APIResponse(201,updatedRequest,`Request ${status} successfully`))
   
    }
    catch (error) {
        res.status(500).json(new APIError(500, "Something went wrong while registering the user"))
    }
})

module.exports = router