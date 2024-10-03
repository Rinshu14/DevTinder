
const mongoose = require('mongoose')

let connectionRequestSchema = new mongoose.Schema({

    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        enum: {
            values: ["Interested", "Accepted", "Rejected", "Ignored"],
            message: "status should be Pending, Accepted or Rejected"
        }
    }
}, { timestamps: true })

connectionRequestSchema.index({fromUserId:1,toUserId:1})

let ConnectionRequestModel = mongoose.model("ConnectionRequest", connectionRequestSchema)

module.exports = ConnectionRequestModel