import mongoose from 'mongoose'

const contestSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  duration: { type: Number, required: true }, // minutes
  status: {
    type: String,
    enum: ['upcoming', 'live', 'ended'],
    default: 'upcoming'
  },
  problems: [{
    problem: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem' },
    points: { type: Number, default: 100 },
    order: { type: Number, default: 0 }
  }],
  participants: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    joinedAt: { type: Date, default: Date.now },
    score: { type: Number, default: 0 },
    rank: { type: Number, default: 0 },
    solvedProblems: [{
      problem: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem' },
      solvedAt: Date,
      points: Number,
      attempts: { type: Number, default: 0 }
    }]
  }],
  banner: { type: String, default: '' },
  isPublic: { type: Boolean, default: true },
  maxParticipants: { type: Number, default: 10000 },
}, { timestamps: true })

export default mongoose.model('Contest', contestSchema)