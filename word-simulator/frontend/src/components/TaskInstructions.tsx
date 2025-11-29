import { Task } from '@/types'
import { X } from 'lucide-react'

interface TaskInstructionsProps {
  task: Task
  isOpen: boolean
  onClose: () => void
}

export const TaskInstructions = ({ task, isOpen, onClose }: TaskInstructionsProps) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{task.title}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
          <p className="text-gray-700 mb-4">{task.description}</p>

          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-4">
            <p className="text-sm font-semibold text-blue-900 mb-2">Worth: {task.points} points</p>
          </div>

          <h3 className="font-semibold text-gray-900 mb-3">Instructions:</h3>
          <ol className="list-decimal list-inside space-y-2">
            {task.instructions.map((instruction, index) => (
              <li key={index} className="text-gray-700">
                {instruction}
              </li>
            ))}
          </ol>
        </div>

        <div className="p-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  )
}
