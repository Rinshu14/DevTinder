const multer  = require('multer')
/////multer is used specially for get access on the files uploaded by user

//const upload = multer({ dest: './public/uploads/' })//telling the multer where to keep our files



const storage = multer.diskStorage({


    destination: function (req, file, cb) {
        //console.log(req.User)
      cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
    //  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    // console.log("_"+req.User._id.toString())
      cb(null, `${req.User._id.toString()}_${file.originalname}`)
    }
  })
  
  const upload = multer({ storage: storage })
  

  module.exports=upload