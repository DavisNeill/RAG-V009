import mongoose from 'mongoose'

const validationResultSchema = new mongoose.Schema({
  ruleId: String,
  passed: Boolean,
  message: String,
  points: Number,
})

const taskResultSchema = new mongoose.Schema({
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  document: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  validationResults: [validationResultSchema],
  score: {
    type: Number,
    default: 0,
  },
  maxScore: {
    type: Number,
    required: true,
  },
  completedAt: {
    type: Date,
    default: Date.now,
  },
})

const testAttemptSchema = new mongoose.Schema(
  {
    test: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Test',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    startTime: {
      type: Date,
      default: Date.now,
    },
    endTime: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['in-progress', 'completed', 'graded'],
      default: 'in-progress',
    },
    taskResults: [taskResultSchema],
    totalScore: {
      type: Number,
      default: 0,
    },
    maxScore: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

// Calculate percentage
testAttemptSchema.virtual('percentage').get(function () {
  return this.maxScore > 0 ? (this.totalScore / this.maxScore) * 100 : 0
})

const TestAttempt = mongoose.model('TestAttempt', testAttemptSchema)

export default TestAttempt
