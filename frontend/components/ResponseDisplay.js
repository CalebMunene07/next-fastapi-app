export default function ResponseDisplay({ response }) {
  return (
    <div className="prose max-w-none">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Answer:</h2>
      <div className="text-gray-700 whitespace-pre-wrap">
        {response}
      </div>
    </div>
  )
}