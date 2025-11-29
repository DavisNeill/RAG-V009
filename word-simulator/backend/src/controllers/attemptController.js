import TestAttempt from '../models/TestAttempt.js'
import Test from '../models/Test.js'

// @desc    Start a new test attempt
// @route   POST /api/attempts
// @access  Private
export const startAttempt = async (req, res) => {
  try {
    const { testId } = req.body

    const test = await Test.findById(testId)

    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found',
      })
    }

    // Calculate max score
    const maxScore = test.tasks.reduce((sum, task) => sum + task.points, 0)

    const attempt = await TestAttempt.create({
      test: testId,
      user: req.user.id,
      maxScore,
    })

    res.status(201).json({
      success: true,
      data: attempt,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// @desc    Get user's test attempts
// @route   GET /api/attempts
// @access  Private
export const getMyAttempts = async (req, res) => {
  try {
    const attempts = await TestAttempt.find({ user: req.user.id })
      .populate('test', 'title description duration')
      .sort('-createdAt')

    res.status(200).json({
      success: true,
      count: attempts.length,
      data: attempts,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// @desc    Get single attempt
// @route   GET /api/attempts/:id
// @access  Private
export const getAttempt = async (req, res) => {
  try {
    const attempt = await TestAttempt.findById(req.params.id)
      .populate('test')
      .populate('user', 'name email')

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: 'Test attempt not found',
      })
    }

    // Make sure user owns this attempt or is admin
    if (attempt.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this attempt',
      })
    }

    res.status(200).json({
      success: true,
      data: attempt,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// @desc    Submit task result
// @route   PUT /api/attempts/:id/tasks/:taskId
// @access  Private
export const submitTaskResult = async (req, res) => {
  try {
    const { document, validationResults, score, maxScore } = req.body

    const attempt = await TestAttempt.findById(req.params.id)

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: 'Test attempt not found',
      })
    }

    // Check ownership
    if (attempt.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      })
    }

    // Add or update task result
    const taskResult = {
      taskId: req.params.taskId,
      document,
      validationResults,
      score,
      maxScore,
      completedAt: new Date(),
    }

    const existingIndex = attempt.taskResults.findIndex(
      (tr) => tr.taskId.toString() === req.params.taskId
    )

    if (existingIndex >= 0) {
      attempt.taskResults[existingIndex] = taskResult
    } else {
      attempt.taskResults.push(taskResult)
    }

    await attempt.save()

    res.status(200).json({
      success: true,
      data: attempt,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// @desc    Submit/Complete test attempt
// @route   PUT /api/attempts/:id/submit
// @access  Private
export const submitAttempt = async (req, res) => {
  try {
    const attempt = await TestAttempt.findById(req.params.id)

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: 'Test attempt not found',
      })
    }

    // Check ownership
    if (attempt.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      })
    }

    // Calculate total score
    const totalScore = attempt.taskResults.reduce((sum, tr) => sum + tr.score, 0)

    attempt.endTime = new Date()
    attempt.status = 'completed'
    attempt.totalScore = totalScore

    await attempt.save()

    res.status(200).json({
      success: true,
      data: attempt,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// @desc    Get all attempts (Admin)
// @route   GET /api/attempts/all
// @access  Private/Admin
export const getAllAttempts = async (req, res) => {
  try {
    const attempts = await TestAttempt.find()
      .populate('test', 'title')
      .populate('user', 'name email')
      .sort('-createdAt')

    res.status(200).json({
      success: true,
      count: attempts.length,
      data: attempts,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}
