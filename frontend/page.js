'use client'
import { useState } from 'react'
import QuestionInput from '@/components/QuestionInput'
import ResponseDisplay from '@/components/ResponseDisplay'

export default function Home() {
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (question, stream = false) => {
    setIsLoading(true)
    setError('')
    setResponse('')
    
    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question, stream }),
      })
      
      if (!res.ok) {
        throw new Error(await res.text())
      }

      if (stream) {
        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          
          const chunk = decoder.decode(value)
          setResponse(prev => prev + chunk)
        }
      } else {
        const data = await res.json()
        setResponse(data.answer)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-green-700 mb-8">
          AI Assistant
        </h1>
        
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <QuestionInput onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
        
        {isLoading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-600"></div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-8 rounded">
            <p>{error}</p>
          </div>
        )}
        
        {response && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <ResponseDisplay response={response} />
          </div>
        )}
      </div>
    </main>
  )
}