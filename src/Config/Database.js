const mongoose = require('mongoose');

const connectDB=async()=>{
   await mongoose.connect("mongodb+srv://namsteDev:Rinshu%4014@cluster0.ehm4e.mongodb.net/devTinder")
}
module.exports=connectDB

// connectDB().then(() => {
//     console.log("connection done")
  
// }).catch((err) => {
//     console.log("databse can not be connected")
//     console.log(err)
// })