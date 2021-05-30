const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/profiles');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

exports.uploadImage = multer({ storage });
