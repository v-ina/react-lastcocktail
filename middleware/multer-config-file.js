const multer = require('multer');

const MIME_TYPES = {
  'application/pdf': 'pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  'application/vnd.ms-excel': 'xls'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'files');  // dossier nommine "images"
  },
  filename: (req, file, callback) => {
    const name = req.body.name.toLowerCase() || file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + `${req.name}` + '.' + extension);
  }
});



module.exports = multer({storage: storage}).single('file');  // apres single, c'est type de fichier