const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const multer = require('multer');
const path = require('path');

// Multer Config for Image Uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.post('/users', upload.single('profileImage'), userController.createUser);
router.get('/users', userController.getUsers);
router.get('/users/export', userController.exportToCSV);
router.get('/users/:id', userController.getUserById);
router.put('/users/:id', upload.single('profileImage'), userController.updateUser);
router.delete('/users/:id', userController.deleteUser);

module.exports = router;
