const express = require('express');
const multer = require('multer');
const PostsController = require('../controllers/posts');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error('Invalid mime type');
        if (isValid) {
            error = null;
        }
        cb(error, 'server/images'); // path is relative to the server.js file
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + '-' + Date.now() + '.' + ext);
    }
})

router.post(
    '',
    checkAuth,
    multer({ storage: storage }).single('image'), 
    PostsController.createPost
);

router.get('', PostsController.getPosts);

router.get('/:id', PostsController.getPost);

router.put(
    '/:id',
    checkAuth, 
    multer({ storage: storage }).single('image'), 
    PostsController.updatePost
);

router.delete(
    '/:id', 
    checkAuth,
    PostsController.deletePost
);

module.exports = router;