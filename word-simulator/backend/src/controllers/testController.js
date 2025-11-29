import Test from '../models/Test.js'

// @desc    Get all tests
// @route   GET /api/tests
// @access  Private
export const getTests = async (req, res) => {
  try {
    const tests = await Test.find({ isActive: true })
      .populate('createdBy', 'name email')
      .sort('-createdAt')

    res.status(200).json({
      success: true,
      count: tests.length,
      data: tests,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// @desc    Get single test
// @route   GET /api/tests/:id
// @access  Private
export const getTest = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id).populate('createdBy', 'name email')

    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found',
      })
    }

    res.status(200).json({
      success: true,
      data: test,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// @desc    Create new test
// @route   POST /api/tests
// @access  Private/Admin
export const createTest = async (req, res) => {
  try {
    const { title, description, duration, tasks } = req.body

    const test = await Test.create({
      title,
      description,
      duration,
      tasks,
      createdBy: req.user.id,
    })

    res.status(201).json({
      success: true,
      data: test,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// @desc    Update test
// @route   PUT /api/tests/:id
// @access  Private/Admin
export const updateTest = async (req, res) => {
  try {
    let test = await Test.findById(req.params.id)

    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found',
      })
    }

    test = await Test.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    res.status(200).json({
      success: true,
      data: test,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// @desc    Delete test
// @route   DELETE /api/tests/:id
// @access  Private/Admin
export const deleteTest = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id)

    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found',
      })
    }

    await test.deleteOne()

    res.status(200).json({
      success: true,
      message: 'Test deleted',
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}
