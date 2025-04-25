const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './public/images');
    },
    filename: function(req, file, cb){
        const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniquePrefix + '-' + file.originalname);
    }
    
})

function avatarUpload(req, res, next){
    const upload = multer({storage: storage}).single('avatar');
    upload(req, res, function(err){
        if(err instanceof multer.MulterError){
            return res.status(400).json({   
                message: err.message
            });
        }else if(err){
            return res.status(500).json({
                message: err.message
            });
        }
        next();
    });
}
module.exports = avatarUpload;