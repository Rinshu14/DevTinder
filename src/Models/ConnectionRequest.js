
const mongoose = require('mongoose')

let connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Users'
    },
    status: {
        type: String,
        enum: {
            values: ["interested", "accepted", "rejected", "ignored"],
            message: "status should be Pending, Accepted or Rejected"
        }
    }
}, { timestamps: true })

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 })
connectionRequestSchema.pre('save', function () {
    this.status = this.status.toLowerCase();
})

let ConnectionRequestModel = mongoose.model("ConnectionRequest", connectionRequestSchema)

module.exports = ConnectionRequestModel