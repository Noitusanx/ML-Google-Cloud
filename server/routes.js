const express = require('express');
const multer = require('multer');
const handlers = require('./handler.js');

const router = express.Router();
const upload = multer();

const uploadVideo = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50 MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'video/mp4') {
      return cb(new Error('Only MP4 file is allowed'));
    }
    cb(null, true);
  },
});

// Prediksi Penyakit
router.post('/predict', upload.single('image'), 
  handlers.postPredict);

router.get('/predict/histories', handlers.getPredictHistories);

// Diskusi
router.post('/discussions', handlers.createDiscussion);

router.get('/discussions', handlers.getAllDiscussions);

router.get('/discussions/:id', handlers.getDiscussion);

router.post('/discussions/:id/comments', handlers.createComment);

router.get('/discussions/:id/comments', handlers.getComments);

// // education
router.post('/educations', uploadVideo.single('video'), handlers.createEducation);

router.get('/educations', handlers.getEducations);


module.exports = router;
