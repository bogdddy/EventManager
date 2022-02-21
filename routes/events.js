const express = require('express');
const router = express.Router();

const eventController = require("../controllers/event.controller");
const auth = require('../middlewares/auth.middleware')

// save images
const multer = require('multer');
const date = Date.now();
const storage_path = multer.diskStorage(
    {
        destination:(request,file,callback)=>{
            callback(null, './public/images/uploads/')
        },
        filename:(request, file, callback)=>{
            callback(null, date+"_"+file.originalname);
        }
    }
)
const load = multer({ storage:storage_path});

router.get('/', eventController.index);
router.get('/show/:id', eventController.show);
router.get('/admin', auth.isEditor, eventController.admin); 
router.post('/store', auth.isEditor, load.single("image"), eventController.store);
router.post('/edit/:id', auth.isEditor, load.single("image"), eventController.edit);
router.post('/delete/:id', auth.isEditor, eventController.delete);

module.exports = router;