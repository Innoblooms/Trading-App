const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {

    let folder = 'uploads/'; 
    if (file.fieldname === 'adhaarImage') {
      folder += 'adhaarImage/';
    } else if (file.fieldname === 'panImage') {
      folder += 'panImage/';
    } else if (file.fieldname === 'bank_statements') {
      folder += 'bank_statements/'
    }

const fs = require('fs');
    if (!fs.existsSync(folder)){
      fs.mkdirSync(folder, { recursive: true });
    }

    cb(null, folder);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

module.exports = upload;