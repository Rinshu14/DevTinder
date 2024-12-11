const express = require("express");
const db = require("./Config/Database");
const app = express();
const cors = require("cors")
require('dotenv').config();
const User = require("./Models/Users");
const cookieParser = require("cookie-parser")
const ProfileRouter = require("./Routers/ProfileRouter")
const AuthRouter = require("./Routers/AuthRouter")
const RequestRouter = require("./Routers/RequestRouter")
const UserRouter = require("./Routers/UserRouter")
const FeedRouter=require("./Routers/FeedRouter")



app.use(cors({origin:"http://localhost:5173",credentials:true}))
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended: true}))
app.use(AuthRouter)
app.use("/profile", ProfileRouter)
app.use("/request", RequestRouter)
app.use("/user", UserRouter)
app.use(FeedRouter)





// app.delete("/deleteUser", async (req, res) => {

//     try {
//         await User.deleteOne({ emailId: req.query.emailId })
//         res.send("user deleted")
//     }
//     catch (error) {
//      //   console.log(error)
//         res.status(400).send("something went wrong")
//     }
// })

const port=process.env.PORT




db().then(() => {
    console.log("connection done")
    app.listen(port, () => {
        console.log("server started");
    });
}).catch((err) => {
    console.log("databse can not be connected")
    console.log(err)
})




