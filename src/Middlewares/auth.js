const Validator = require("../Utils/Validator")
const User = require("../Models/Users")
const jwt = require("jsonwebtoken")
let userAuth = async function (req, res, next) {
    try {

        let { token } = req.cookies
    //    console.log(token)
        if (!token) throw new Error("token not found")

        let decToken = await jwt.verify(token, "Rinshu@14")
       // console.log("verify")
        let data = await User.find({ _id: decToken.id })
       // console.log("after verify")
        if (!data) throw new Error("user not found")
        req.User = data[0];
        next();
    }
    catch (error) {
      
        res.status(401).json({data:{},message:"inavlid credentials"})

    }
}

module.exports = userAuth 