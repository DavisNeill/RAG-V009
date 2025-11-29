import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { config } from './config/config.js'
import connectDB from './config/database.js'

// Import routes
import authRoutes from './routes/authRoutes.js'
import testRoutes from './routes/testRoutes.js'
import attemptRoutes from './routes/attemptRoutes.js'

// Initialize express app
const app = express()

// Connect to database
connectDB()

// Middleware
app.use(cors({ origin: config.corsOrigin }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Logging
if (config.env === 'development') {
  app.use(morgan('dev'))
}

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/tests', testRoutes)
app.use('/api/attempts', attemptRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  })
})

// Start server
const PORT = config.port

app.listen(PORT, () => {
  console.log(`Server running in ${config.env} mode on port ${PORT}`)
})

export default app
