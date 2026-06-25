import express from 'express'
import { getAIReview } from '../controllers/reviewController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

router.post('/', protect, getAIReview)

export default router