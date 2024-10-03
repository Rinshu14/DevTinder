const express = require("express");
const db = require("./Config/Database");
const app = express();
const User = require("./Models/Users");
const cookieParser = require("cookie-parser")
const ProfileRouter = require("./Routers/ProfileRouter")
const AuthRouter = require("./Routers/AuthRouter")
const RequestRouter=require("./Routers/RequestRouter")


app.use(express.json())
app.use(cookieParser())
app.use(AuthRouter)
app.use("/profile", ProfileRouter)
app.use("/request",RequestRouter)


app.delete("/deleteUser", async (req, res) => {

    try {
        await User.deleteOne({ emailId: req.query.emailId })
        res.send("user deleted")
    }
    catch (error) {
        console.log(error)
        res.status(400).send("something went wrong")
    }
})




app.use("/", (req, res) => {
    res.status(400).send("hello world")


})







db().then(() => {
    console.log("connection done")
    app.listen(3000, () => {
        console.log("server started");
    });
}).catch((err) => {
    console.log("databse can not be connected")
    console.log(err)
})
