import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from '../models/User.js'
import Test from '../models/Test.js'

dotenv.config()

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('MongoDB Connected')
  } catch (error) {
    console.error(`Error: ${error.message}`)
    process.exit(1)
  }
}

const seedData = async () => {
  try {
    await connectDB()

    // Clear existing data
    await User.deleteMany({})
    await Test.deleteMany({})

    console.log('Data cleared')

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
    })

    // Create sample students
    await User.create([
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'student123',
        role: 'student',
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'student123',
        role: 'student',
      },
    ])

    console.log('Users created')

    // Create sample tests
    await Test.create([
      {
        title: 'Microsoft Word Basics Test',
        description: 'Test your basic Word formatting skills including text formatting, lists, and tables.',
        duration: 30,
        tasks: [
          {
            title: 'Format a Business Letter Heading',
            description: 'Create a properly formatted business letter heading',
            instructions: [
              'Type "Business Letter" as the heading',
              'Format the heading as bold',
              'Set font size to 18pt',
              'Center-align the heading',
            ],
            expectedFormat: {
              elements: [
                {
                  type: 'text',
                  selector: 'Business Letter',
                  properties: new Map([
                    ['bold', true],
                    ['fontSize', 18],
                  ]),
                  points: 10,
                },
                {
                  type: 'paragraph',
                  selector: 'Business Letter',
                  properties: new Map([['align', 'center']]),
                  points: 5,
                },
              ],
            },
            points: 15,
            order: 1,
          },
          {
            title: 'Create a Bulleted List',
            description: 'Create a bulleted list with key points',
            instructions: [
              'Create a bulleted list',
              'Add at least 3 items',
              'Ensure proper formatting',
            ],
            expectedFormat: {
              elements: [
                {
                  type: 'list',
                  properties: new Map([['listType', 'bulleted']]),
                  points: 10,
                },
              ],
            },
            points: 10,
            order: 2,
          },
          {
            title: 'Insert and Format a Table',
            description: 'Insert a table with proper structure',
            instructions: [
              'Insert a 3x4 table (3 rows, 4 columns)',
              'Add headers in the first row',
              'Apply bold formatting to headers',
            ],
            expectedFormat: {
              elements: [
                {
                  type: 'table',
                  properties: new Map([
                    ['tableRows', 3],
                    ['tableCols', 4],
                  ]),
                  points: 15,
                },
              ],
            },
            points: 15,
            order: 3,
          },
        ],
        createdBy: admin._id,
        isActive: true,
      },
      {
        title: 'Advanced Formatting Test',
        description: 'Test advanced formatting skills',
        duration: 45,
        tasks: [
          {
            title: 'Format Complex Document',
            description: 'Apply multiple formatting styles',
            instructions: [
              'Create a document with heading and body text',
              'Use different font sizes and styles',
              'Apply colors and highlighting',
            ],
            expectedFormat: {
              elements: [],
            },
            points: 25,
            order: 1,
          },
          {
            title: 'Insert Images',
            description: 'Add and position images',
            instructions: [
              'Insert an image into the document',
              'Position it appropriately',
            ],
            expectedFormat: {
              elements: [
                {
                  type: 'image',
                  properties: new Map(),
                  points: 15,
                },
              ],
            },
            points: 15,
            order: 2,
          },
        ],
        createdBy: admin._id,
        isActive: true,
      },
    ])

    console.log('Sample tests created')
    console.log('Seed data created successfully')
    process.exit(0)
  } catch (error) {
    console.error(`Error: ${error.message}`)
    process.exit(1)
  }
}

seedData()
