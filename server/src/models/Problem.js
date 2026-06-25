import mongoose from 'mongoose'

const problemSchema = new mongoose.Schema({
  company:       [{ type: String }],
hints:         [{ type: String }],
acceptanceRate:{ type: Number, default: 0 },
timeLimit:     { type: Number, default: 1000 },
memoryLimit:   { type: Number, default: 256 },
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true
  },
  tags: [{ type: String }],
  examples: [{
    input: String,
    output: String,
    explanation: String
  }],
  constraints: [String],
  starterCode: {
    javascript: { type: String, default: '// Write your solution here\n' },
    python: { type: String, default: '# Write your solution here\n' },
  },
  testCases: [{
    input: String,
    expectedOutput: String,
    isHidden: { type: Boolean, default: false }
  }],
  solvedBy: { type: Number, default: 0 },
  xpReward: { type: Number, default: 10 },
}, { timestamps: true })

export default mongoose.model('Problem', problemSchema)