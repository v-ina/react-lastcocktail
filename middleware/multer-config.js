const multer = require('multer')

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'application/pdf' : 'pdf'
};


  const storage = multer.diskStorage({
    destination: (req, file, callback) => {
    callback(null, 'attachments')  // dossier nommine "images"
    console.log('multer ok');
  },
  filename: (req, file, callback) => {
    console.log(file);
    const name = file.originalname.split(' ').join('_')
    // const name = req.body.name.toLowerCase() || file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype]
    callback(null, name + `${req.name}` + '.' + extension);
  }
});

// `${req.protocol}://${req.get('host')}/files/${req.file.filename}`


module.exports =  multer({storage: storage}).array('file', 5);  // apres single, c'est type de fichier