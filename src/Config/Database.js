const mongoose = require('mongoose');

const connectDB=async()=>{
   await mongoose.connect(process.env.MONGODBCONNECTIONSTRING)
}
module.exports=connectDB

// connectDB().then(() => {
//     console.log("connection done")
  
// }).catch((err) => {
//     console.log("databse can not be connected")
//     console.log(err)
// })