
const Validator = require("validator")
const allowedUpdates = require("../Constants/Constants").allowedUpdates
const emailValidator = (data) => {
    if (!Validator.isEmail(data)) throw new Error("email is not valid")
}

const ValidateUpdateUserData = (data) => {
  
    if (!data) throw new Error("data not found")
    try {
        for (let key in data) {
            // console.log(key)
            if (!allowedUpdates.includes(key)) throw new Error("only first Name, last name, skills, password, age and Photo Url can be updated")
        }
        if (data.skills && data.skills.length > 10) throw new Error("skills can not be more than 10")
    }
    catch (error) {
       throw new Error(error.message)
    }

}

module.exports = { emailValidator,ValidateUpdateUserData }