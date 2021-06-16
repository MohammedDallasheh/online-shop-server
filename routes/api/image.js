const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();

const { auth, auth2 } = require('../../middleware/auth');

const {
  getImage,
  deleteImage,
  uploadImage,
} = require('../../controllers/image');

//MiddleWare
router.post('*', auth, upload.single('file'));
router.delete('*', auth);

router.post('/user/imgs', uploadImage);
router.post('/user/avatar', uploadImage);

router.post('/:resource/:resourceId/:path', uploadImage);

router.get('/:imageId', auth2, getImage);
// router.delete('/:imageId', auth, deleteImage);
router.delete('/:resource/:resourceId/:path/:imgId', deleteImage);

module.exports = router;
