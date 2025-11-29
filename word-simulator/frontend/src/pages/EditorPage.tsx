import { useState, useMemo, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { createEditor, Descendant } from 'slate'
import { withReact } from 'slate-react'
import { withHistory } from 'slate-history'
import { CustomEditor, PageSettings, DEFAULT_PAGE_SETTINGS, Task, Test } from '@/types'
import { Ribbon } from '@/components/Ribbon'
import DocumentEditor from '@/components/DocumentEditor'
import { TaskPanel } from '@/components/TaskPanel'
import { TaskInstructions } from '@/components/TaskInstructions'
import { Timer } from '@/components/Timer'
import { Info, Send } from 'lucide-react'
import { initialValue } from '@/utils/slateUtils'

// Mock test data - will be replaced with API call
const mockTest: Test = {
  id: '1',
  title: 'Microsoft Word Basics Test',
  description: 'Test your basic Word formatting skills',
  duration: 30,
  tasks: [
    {
      id: 'task-1',
      testId: '1',
      title: 'Format a Business Letter',
      description: 'Create a properly formatted business letter with specific formatting requirements',
      instructions: [
        'Type the heading "Business Letter" and format it as bold, 18pt, centered',
        'Add a paragraph with your name and address',
        'Create a bulleted list with at least 3 items',
        'Apply Arial font to the entire document',
      ],
      expectedFormat: {
        elements: [],
      },
      points: 25,
      order: 1,
    },
    {
      id: 'task-2',
      testId: '1',
      title: 'Create a Table',
      description: 'Insert and format a table with specific requirements',
      instructions: [
        'Insert a 4x3 table',
        'Add headers in the first row',
        'Apply bold formatting to headers',
        'Center-align the table content',
      ],
      expectedFormat: {
        elements: [],
      },
      points: 20,
      order: 2,
    },
  ],
  createdBy: 'admin',
  createdAt: new Date(),
  isActive: true,
}

const EditorPage = () => {
  const { testId } = useParams()
  const navigate = useNavigate()
  const editor = useMemo(() => withHistory(withReact(createEditor() as CustomEditor)), [])

  const [test] = useState<Test>(mockTest)
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0)
  const [documents, setDocuments] = useState<Map<string, Descendant[]>>(
    new Map(test.tasks.map(task => [task.id, initialValue]))
  )
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set())
  const [showInstructions, setShowInstructions] = useState(true)
  const [pageSettings, setPageSettings] = useState<PageSettings>(DEFAULT_PAGE_SETTINGS)
  const [zoom, setZoom] = useState(100)
  const [startTime] = useState(new Date())

  const currentTask = test.tasks[currentTaskIndex]
  const currentDocument = documents.get(currentTask.id) || initialValue

  const handleDocumentChange = useCallback((value: Descendant[]) => {
    setDocuments(prev => new Map(prev).set(currentTask.id, value))
  }, [currentTask.id])

  const handleTaskSelect = (index: number) => {
    setCurrentTaskIndex(index)
    setShowInstructions(true)
  }

  const handleNextTask = () => {
    if (currentTaskIndex < test.tasks.length - 1) {
      setCurrentTaskIndex(currentTaskIndex + 1)
      setShowInstructions(true)
    }
  }

  const handlePreviousTask = () => {
    if (currentTaskIndex > 0) {
      setCurrentTaskIndex(currentTaskIndex - 1)
      setShowInstructions(true)
    }
  }

  const handleMarkComplete = () => {
    setCompletedTasks(prev => new Set(prev).add(currentTask.id))
    if (currentTaskIndex < test.tasks.length - 1) {
      handleNextTask()
    }
  }

  const handleSubmitTest = () => {
    if (window.confirm('Are you sure you want to submit your test? This cannot be undone.')) {
      // TODO: Send to validation and grading
      navigate('/tests')
    }
  }

  const handleTimeUp = () => {
    alert('Time is up! Your test will be submitted automatically.')
    handleSubmitTest()
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-word-blue text-white px-6 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">{test.title}</h1>
          <p className="text-sm text-blue-100">
            Task {currentTaskIndex + 1} of {test.tasks.length}: {currentTask.title}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Timer
            durationMinutes={test.duration}
            onTimeUp={handleTimeUp}
            startTime={startTime}
          />
          <button
            onClick={() => setShowInstructions(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded transition-colors"
          >
            <Info size={18} />
            Show Instructions
          </button>
          <button
            onClick={handleSubmitTest}
            className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 rounded transition-colors font-semibold"
          >
            <Send size={18} />
            Submit Test
          </button>
        </div>
      </div>

      {/* Ribbon */}
      <Ribbon
        editor={editor}
        pageSettings={pageSettings}
        onPageSettingsChange={setPageSettings}
        zoom={zoom}
        onZoomChange={setZoom}
      />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor */}
        <div className="flex-1 overflow-hidden" style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}>
          <DocumentEditor
            value={currentDocument}
            onChange={handleDocumentChange}
            pageSettings={pageSettings}
          />
        </div>

        {/* Task Panel */}
        <TaskPanel
          tasks={test.tasks}
          currentTaskIndex={currentTaskIndex}
          onTaskSelect={handleTaskSelect}
          completedTasks={completedTasks}
        />
      </div>

      {/* Footer */}
      <div className="bg-gray-100 border-t border-gray-300 px-6 py-3 flex items-center justify-between">
        <button
          onClick={handlePreviousTask}
          disabled={currentTaskIndex === 0}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous Task
        </button>

        <button
          onClick={handleMarkComplete}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold"
        >
          Mark as Complete
        </button>

        <button
          onClick={handleNextTask}
          disabled={currentTaskIndex === test.tasks.length - 1}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next Task
        </button>
      </div>

      {/* Task Instructions Modal */}
      <TaskInstructions
        task={currentTask}
        isOpen={showInstructions}
        onClose={() => setShowInstructions(false)}
      />
    </div>
  )
}

export default EditorPage
