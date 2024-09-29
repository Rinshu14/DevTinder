const express = require("express");
const db = require("./Config/Database");
const app = express();
const User = require("./Models/Users");
const Validator=require("./Utils/Validator")
const bcrypt = require("bcrypt")

db().then(() => {
    console.log("connection done")
    app.listen(3000, () => {
        console.log("server started");
    });
}).catch((err) => {
    console.log("databse can not be connected")
    console.log(err)
})


app.use(express.json())

app.post("/signup", async (req, res) => {
    try {
        let { firstName, lastName, emailId, password, gender, age, skills } = req.body
        let hashedPassword = await bcrypt.hash(password, 10)
        console.log(hashedPassword)
        let user = new User({ firstName, lastName, emailId, password: hashedPassword, gender, age, skills })

        // if (!Validator.isEmail(user.emailId)) throw new Error("email is not valid")

        await user.save()
        res.send("data inserted")
    } catch (error) {
        res.send(error.message)
    }
})

app.patch("/updateUser", async (req, res) => {
    let id = req.query.id
    console.log(id)
    let allowedUpdates = ["firstName", "lastName", "password", "skills"]
    try {
        for (let key in req.body) {

            if (!allowedUpdates.includes(key)) throw new Error("only first Name, last name,skills and password can be updated")
        }
        if (req.body.skills && req.body.skills.length > 10) throw new Error("skills can not be more than 10")


        let data = await User.findByIdAndUpdate(id, req.body, { returnDocument: "before" })
        console.log(data)
        res.send("user updated")
    }
    catch (error) {

        res.status(400).send(error.message)
    }
})
app.get("/getUser", async (req, res) => {

    try {
        let emailId = req.query.emailId
        let data = await User.find({ emailId: emailId })

        if (data.length > 0) {
            res.send(data)
        }
        else {
            res.send("user not found")
        }

    }
    catch (error) {
        console.log(error)
        res.status(400).send("something went wrong gh")
    }
})


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
app.post("/login", async (req, res) => {
    try {

        let { emailId, password } = req.body

        if (!Validator.emailValidator(emailId)) throw new Error("email is not valid")
        let data = await User.findOne({ emailId })
        if (!data) throw new Error("invalid credentials")
        let flag = await bcrypt.compare(password, data.password)
        if (flag) res.send("login success")
        else throw new Error("invalid credentials")

    }
    catch (error) {
        res.status(400).send(error.message)
    }

})

app.get("/feed", async (req, res) => {
    try {
        let data = await User.find({})
        res.send(data)
    }
    catch (error) {
        res.send("something went wrong")
    }
})

app.use("/", (req, res) => {
    res.status(400).send("hello world")
})






