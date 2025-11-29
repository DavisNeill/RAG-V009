import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, Plus, Users, BarChart, LogOut } from 'lucide-react'

const AdminPage = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'tests' | 'students' | 'results'>('tests')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-word-blue text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText size={32} />
              <div>
                <h1 className="text-2xl font-bold">Admin Panel</h1>
                <p className="text-blue-100 text-sm">Test Management System</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-colors"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('tests')}
              className={`px-4 py-4 border-b-2 font-medium transition-colors ${
                activeTab === 'tests'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText size={18} />
                Tests
              </div>
            </button>
            <button
              onClick={() => setActiveTab('students')}
              className={`px-4 py-4 border-b-2 font-medium transition-colors ${
                activeTab === 'students'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Users size={18} />
                Students
              </div>
            </button>
            <button
              onClick={() => setActiveTab('results')}
              className={`px-4 py-4 border-b-2 font-medium transition-colors ${
                activeTab === 'results'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <BarChart size={18} />
                Results
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'tests' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Manage Tests</h2>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                <Plus size={18} />
                Create New Test
              </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-8 text-center text-gray-500">
                <FileText size={48} className="mx-auto mb-4 text-gray-400" />
                <p>Test management interface coming soon</p>
                <p className="text-sm mt-2">Create, edit, and manage student tests</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'students' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Student Management</h2>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                <Plus size={18} />
                Add Student
              </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-8 text-center text-gray-500">
                <Users size={48} className="mx-auto mb-4 text-gray-400" />
                <p>Student management interface coming soon</p>
                <p className="text-sm mt-2">View and manage student accounts</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'results' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Test Results & Analytics</h2>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-8 text-center text-gray-500">
                <BarChart size={48} className="mx-auto mb-4 text-gray-400" />
                <p>Results and analytics interface coming soon</p>
                <p className="text-sm mt-2">View student performance and generate reports</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPage
