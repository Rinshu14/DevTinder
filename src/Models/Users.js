
const mongoose = require('mongoose')
const Validator = require('validator')
const dataValidation = require("../Utils/Validator")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 10
    },
    lastName: {
        type: String,
        maxLength: 10,

    },
    emailId: {
        type: String,
        required: true,
        trim: true,
        immutable: true,
        unique: true,
        validate: {
            validator: (value) => {
                return dataValidation.emailValidator(value)
            },
        }

    },
    password: {
        type: String,
        required: true,
        minLength: 8,
        validate: {
            validator: (value) => {
                if (!Validator.isStrongPassword(value)) throw new Error("password is not strong")
            },
        }
    },
    gender: {
        type: String,
        enum: {
            values: ["Male", "Female", "Others"],
            message: "gender should be Male, Female or Others"
        }
    },
    age: {
        type: Number,
        min: 18,
        required:true
    },
    skills: {
        type: [String],
    },
    photoUrl: {
        type: String,
        validate: {
            validator: (value) => {
                if (!Validator.isURL(value)) throw new Error("Photo url is not valid")
            }
        }
    },
    theme:{
        type:String,
        default:"cupcake"
    },
    about:{
        type:String,
    }

}, { timestamps: true }

)
userSchema.index({ emailId: 1 })
userSchema.methods.getJwtToken = async function () {
    // console.log("in jwt method")
    // console.log(this._id)

    let jwtToken = await jwt.sign({ id: this._id }, "Rinshu@14")

    return jwtToken
}


userSchema.methods.isPasswordValid = async function (passwordByUser) {
    return await bcrypt.compare(passwordByUser, this.password)
}

userSchema.methods.isPasswordValid = async function (passwordByUser) {
    return await bcrypt.compare(passwordByUser, this.password)
}


const Users = mongoose.model("Users", userSchema)

module.exports = Users;