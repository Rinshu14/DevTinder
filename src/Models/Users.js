
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
            values: ["male", "female", "others"],
            message: "gender should be Male, Female or Others"
        }
    },
    age: {
        type: Number,
        min: 18,
        required: true
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
    theme: {
        type: String,
        default: "light"
    },
    about: {
        type: String,
    }

}, { timestamps: true }

)
userSchema.index({ emailId: 1 })
userSchema.methods.getJwtToken = async function () {
  

    let jwtToken = await jwt.sign({ id: this._id }, process.env.JWTPRIVATEKEY)

    return jwtToken
}


userSchema.methods.isPasswordValid = async function (passwordByUser) {
    return await bcrypt.compare(passwordByUser, this.password)
}

userSchema.methods.isPasswordValid = async function (passwordByUser) {
    return await bcrypt.compare(passwordByUser, this.password)
}

userSchema.pre('save', function () {
   
    this.emailId = this.emailId.toLowerCase();
    this.gender = this.gender.toLowerCase();
    this.theme = this.theme.toLowerCase();

})

const Users = mongoose.model("Users", userSchema)

module.exports = Users;