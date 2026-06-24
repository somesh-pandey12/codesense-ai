import mongoose from 'mongoose'

const submissionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  problem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true
  },
  code: { type: String, required: true },
  language: {
    type: String,
    enum: ['javascript', 'python'],
    required: true
  },
  status: {
    type: String,
    enum: ['Accepted', 'Wrong Answer', 'Runtime Error', 'Pending'],
    default: 'Pending'
  },
  passedTests: { type: Number, default: 0 },
  totalTests:  { type: Number, default: 0 },
  runtime:     { type: Number, default: 0 },  // ms
  errorMessage: { type: String, default: '' },
  xpEarned:    { type: Number, default: 0 },
}, { timestamps: true })

export default mongoose.model('Submission', submissionSchema)