import { Task } from '@/types'
import { Clock, CheckCircle, Circle } from 'lucide-react'
import { clsx } from 'clsx'

interface TaskPanelProps {
  tasks: Task[]
  currentTaskIndex: number
  onTaskSelect: (index: number) => void
  completedTasks: Set<string>
}

export const TaskPanel = ({
  tasks,
  currentTaskIndex,
  onTaskSelect,
  completedTasks,
}: TaskPanelProps) => {
  return (
    <div className="w-80 bg-white border-l border-gray-300 flex flex-col h-full">
      <div className="p-4 border-b border-gray-300">
        <h2 className="text-lg font-semibold text-gray-800">Tasks</h2>
        <p className="text-sm text-gray-600 mt-1">
          {completedTasks.size} of {tasks.length} completed
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {tasks.map((task, index) => {
          const isCompleted = completedTasks.has(task.id)
          const isCurrent = index === currentTaskIndex

          return (
            <button
              key={task.id}
              onClick={() => onTaskSelect(index)}
              className={clsx(
                'w-full p-4 text-left border-b border-gray-200 transition-colors',
                isCurrent && 'bg-blue-50 border-l-4 border-l-blue-600',
                !isCurrent && 'hover:bg-gray-50'
              )}
            >
              <div className="flex items-start gap-3">
                {isCompleted ? (
                  <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={20} />
                ) : (
                  <Circle className="text-gray-400 flex-shrink-0 mt-1" size={20} />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">
                    {index + 1}. {task.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {task.description}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      {task.points} points
                    </span>
                  </div>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
