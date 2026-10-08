/* routes/meRoutes.js — routes for the logged-in player (require x-user-id + x-player-code) */
const express = require('express');
const user = require('../controllers/userController');
const progress = require('../controllers/progressController');
const { requirePlayer, validateLessonId } = require('../middleware/auth');

const router = express.Router();
router.use(requirePlayer); // every route below needs a valid player

router.get('/', user.getMe);                  // GET    /api/me
router.patch('/', user.updateMe);             // PATCH  /api/me
router.delete('/', user.deleteMe);            // DELETE /api/me
router.post('/reset', user.resetMe);          // POST   /api/me/reset
router.get('/export', user.exportMe);         // GET    /api/me/export

router.post('/lessons/:lessonId/visit', validateLessonId, progress.visitLesson);
router.post('/lessons/:lessonId/activity', validateLessonId, progress.completeActivity);
router.post('/lessons/:lessonId/quiz', validateLessonId, progress.submitQuiz);

module.exports = router;
