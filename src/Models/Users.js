const e = require('express')
const mongoose = require('mongoose')
const Validator = require('validator')

const dataValidation=require("../Utils/Validator")

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
        enum: ["Male", "Female", "Others"]
    },
    age: {
        type: Number,
        min: 18,
    },
    skills: {
        type: [String],
    }

}, { timestamps: true }
)


const Users = mongoose.model("Users", userSchema)

module.exports = Users;