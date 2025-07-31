'use client'
import { useState } from 'react'

export default function QuestionInput({ onSubmit, isLoading }) {
  const [question, setQuestion] = useState('')
  const [stream, setStream] = useState(true)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (question.trim()) {
      onSubmit(question, stream)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-2">
          Ask your question
        </label>
        <textarea
          id="question"
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Type your question here..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          disabled={isLoading}
          required
        />
      </div>
      
      <div className="flex items-center">
        <input
          id="stream-toggle"
          type="checkbox"
          checked={stream}
          onChange={(e) => setStream(e.target.checked)}
          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
          disabled={isLoading}
        />
        <label htmlFor="stream-toggle" className="ml-2 block text-sm text-gray-700">
          Stream response
        </label>
      </div>
      
      <button
        type="submit"
        disabled={isLoading || !question.trim()}
        className={`w-full py-2 px-4 rounded-lg text-white font-medium ${isLoading ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'} focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors`}
      >
        {isLoading ? 'Processing...' : 'Ask Question'}
      </button>
    </form>
  )
}