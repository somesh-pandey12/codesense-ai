import express from 'express'
import {
  getContests,
  getContest,
  registerContest,
  contestSubmit,
  getContestLeaderboard,
  seedContests
} from '../controllers/contestController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

router.get('/',                      protect, getContests)
router.get('/seed',                  protect, seedContests)
router.get('/:id',                   protect, getContest)
router.post('/:id/register',         protect, registerContest)
router.post('/:id/submit',           protect, contestSubmit)
router.get('/:id/leaderboard',       protect, getContestLeaderboard)

export default router