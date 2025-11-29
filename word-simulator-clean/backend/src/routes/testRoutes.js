import express from 'express'
import {
  getTests,
  getTest,
  createTest,
  updateTest,
  deleteTest,
} from '../controllers/testController.js'
import { protect, authorize } from '../middleware/auth.js'

const router = express.Router()

router
  .route('/')
  .get(protect, getTests)
  .post(protect, authorize('admin'), createTest)

router
  .route('/:id')
  .get(protect, getTest)
  .put(protect, authorize('admin'), updateTest)
  .delete(protect, authorize('admin'), deleteTest)

export default router
