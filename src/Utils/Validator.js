
const Validator=require("validator")
const emailValidator = (data) => {
    if(!Validator.isEmail(data)) throw new Error("email is not valid")
}

module.exports={emailValidator}