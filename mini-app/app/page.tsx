'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function Home() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const askBackend = async () => {
    setLoading(true);
    setAnswer('');
    try {
      const res = await fetch('http://localhost:8000/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, stream: false }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Backend error');
      }

      const data = await res.json();
      setAnswer(data.answer);
    } catch (err: any) {
      setAnswer(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">

        {/* Next.js Logo */}
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />

        {/* Instructions */}
        <ol className="font-mono list-inside list-decimal text-sm/6 text-center sm:text-left">
          <li className="mb-2 tracking-[-.01em]">
            Get started by editing{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] font-mono font-semibold px-1 py-0.5 rounded">
              app/page.tsx
            </code>
            .
          </li>
          <li className="tracking-[-.01em]">
            Save and see your changes instantly.
          </li>
        </ol>

        {/* 🧠 AI Question Section */}
        <div className="border rounded-lg p-6 w-full max-w-md bg-gray-50 dark:bg-gray-900">
          <h2 className="text-lg font-semibold mb-2">Ask the AI</h2>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Type your question..."
            className="w-full px-3 py-2 border rounded mb-2"
          />
          <button
            onClick={askBackend}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
          >
            {loading ? 'Asking...' : 'Ask'}
          </button>
          {answer && (
            <p className="mt-4 text-sm text-green-700 dark:text-green-300">
              <strong>Answer:</strong> {answer}
            </p>
          )}
        </div>

        {/* Links (unchanged) */}
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          {/* Your deploy and docs buttons */}
        </div>
      </main>

      {/* Footer (unchanged) */}
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        {/* Your footer links */}
      </footer>
    </div>
  );
}
