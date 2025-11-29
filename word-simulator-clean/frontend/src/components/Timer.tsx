import { useEffect, useState } from 'react'
import { Clock, AlertCircle } from 'lucide-react'

interface TimerProps {
  durationMinutes: number
  onTimeUp: () => void
  startTime: Date
}

export const Timer = ({ durationMinutes, onTimeUp, startTime }: TimerProps) => {
  const [remainingSeconds, setRemainingSeconds] = useState(durationMinutes * 60)

  useEffect(() => {
    const endTime = new Date(startTime.getTime() + durationMinutes * 60 * 1000)

    const interval = setInterval(() => {
      const now = new Date()
      const diff = Math.floor((endTime.getTime() - now.getTime()) / 1000)

      if (diff <= 0) {
        setRemainingSeconds(0)
        clearInterval(interval)
        onTimeUp()
      } else {
        setRemainingSeconds(diff)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [durationMinutes, startTime, onTimeUp])

  const hours = Math.floor(remainingSeconds / 3600)
  const minutes = Math.floor((remainingSeconds % 3600) / 60)
  const seconds = remainingSeconds % 60

  const isLowTime = remainingSeconds <= 300 // 5 minutes

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded ${
      isLowTime ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
    }`}>
      {isLowTime ? <AlertCircle size={20} /> : <Clock size={20} />}
      <span className="font-mono text-lg font-semibold">
        {hours > 0 && `${hours}:`}
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  )
}
