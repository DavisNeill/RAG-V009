import express from 'express'
import {
  startAttempt,
  getMyAttempts,
  getAttempt,
  submitTaskResult,
  submitAttempt,
  getAllAttempts,
} from '../controllers/attemptController.js'
import { protect, authorize } from '../middleware/auth.js'

const router = express.Router()

router.route('/').post(protect, startAttempt).get(protect, getMyAttempts)

router.get('/all', protect, authorize('admin'), getAllAttempts)

router
  .route('/:id')
  .get(protect, getAttempt)

router.put('/:id/tasks/:taskId', protect, submitTaskResult)
router.put('/:id/submit', protect, submitAttempt)

export default router
