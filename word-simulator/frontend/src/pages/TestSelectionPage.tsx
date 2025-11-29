import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, Clock, Award, LogOut } from 'lucide-react'
import { Test } from '@/types'

// Mock test data - will be replaced with API call
const mockTests: Test[] = [
  {
    id: '1',
    title: 'Microsoft Word Basics Test',
    description: 'Test your basic Word formatting skills including text formatting, lists, and tables.',
    duration: 30,
    tasks: [],
    createdBy: 'admin',
    createdAt: new Date(),
    isActive: true,
  },
  {
    id: '2',
    title: 'Advanced Formatting Test',
    description: 'Advanced test covering complex formatting, styles, headers/footers, and page layout.',
    duration: 45,
    tasks: [],
    createdBy: 'admin',
    createdAt: new Date(),
    isActive: true,
  },
  {
    id: '3',
    title: 'Professional Document Creation',
    description: 'Create professional documents with proper formatting, tables, images, and citations.',
    duration: 60,
    tasks: [],
    createdBy: 'admin',
    createdAt: new Date(),
    isActive: true,
  },
]

const TestSelectionPage = () => {
  const navigate = useNavigate()
  const [tests, setTests] = useState<Test[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }

    // TODO: Replace with actual API call
    // fetch('/api/tests', {
    //   headers: { Authorization: `Bearer ${token}` }
    // }).then(res => res.json()).then(setTests)

    // Mock data
    setTimeout(() => {
      setTests(mockTests)
      setLoading(false)
    }, 500)
  }, [navigate])

  const handleStartTest = (testId: string) => {
    navigate(`/editor/${testId}`)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tests...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="text-blue-600" size={32} />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Word Simulator</h1>
                <p className="text-sm text-gray-600">Select a test to begin</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Available Tests</h2>
          <p className="text-gray-600">Choose a test to start practicing your Word skills</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map((test) => (
            <div
              key={test.id}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden"
            >
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
                <h3 className="text-xl font-bold mb-2">{test.title}</h3>
                <div className="flex items-center gap-4 text-blue-100">
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    <span className="text-sm">{test.duration} min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Award size={16} />
                    <span className="text-sm">{test.tasks.length || 'Multiple'} tasks</span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <p className="text-gray-700 mb-4 line-clamp-3">{test.description}</p>

                <button
                  onClick={() => handleStartTest(test.id)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  Start Test
                </button>
              </div>
            </div>
          ))}
        </div>

        {tests.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No tests available</h3>
            <p className="text-gray-600">Check back later for new tests</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default TestSelectionPage
