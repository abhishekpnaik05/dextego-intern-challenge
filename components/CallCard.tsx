import Link from 'next/link'
import { Clock, TrendingUp, MessageSquare } from 'lucide-react'
import { Call } from '../lib/types'
import { formatDuration, formatDate, getOutcomeColor, cn } from '../lib/utils'

interface CallCardProps {
  call: Call
}

export function CallCard({ call }: CallCardProps) {
  return (
    <Link href={`/calls/${call.id}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-6 hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {call.prospectName}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {formatDate(call.date)} {/* ✅ fixed */}
            </p>
          </div>
          <span className={cn(
            "px-2 py-1 rounded-full text-xs font-medium",
            getOutcomeColor(call.outcome)
          )}>
            {call.outcome.replace('-', ' ')}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {formatDuration(call.duration)}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {Math.round(call.talkTimeRatio * 100)}% talk
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {call.questionsAsked} questions
            </span>
          </div>
        </div>

        {call.notes && (
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
            {call.notes}
          </p>
        )}

        {call.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {call.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
