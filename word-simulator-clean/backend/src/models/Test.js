import mongoose from 'mongoose'

const formatRuleSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['text', 'paragraph', 'list', 'table', 'image', 'header', 'footer'],
    required: true,
  },
  selector: String,
  properties: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
  },
  required: {
    type: Boolean,
    default: false,
  },
  points: {
    type: Number,
    default: 0,
  },
})

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  instructions: [
    {
      type: String,
      required: true,
    },
  ],
  expectedFormat: {
    elements: [formatRuleSchema],
  },
  points: {
    type: Number,
    required: true,
    default: 0,
  },
  order: {
    type: Number,
    required: true,
  },
})

const testSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a test title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a test description'],
    },
    duration: {
      type: Number,
      required: [true, 'Please provide test duration in minutes'],
      min: 1,
    },
    tasks: [taskSchema],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

// Calculate total points
testSchema.virtual('totalPoints').get(function () {
  return this.tasks.reduce((sum, task) => sum + task.points, 0)
})

const Test = mongoose.model('Test', testSchema)

export default Test
