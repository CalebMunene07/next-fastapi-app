export async function POST(request) {
  const { question, stream } = await request.json()
  
  try {
    const response = await fetch('http://localhost:8000/api/ask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question, stream }),
    })

    if (!response.ok) {
      throw new Error(await response.text())
    }

    if (stream) {
      return new Response(response.body, {
        headers: { 'Content-Type': 'text/event-stream' },
      })
    } else {
      return Response.json(await response.json())
    }
  } catch (error) {
    return Response.json(
      { error: error.message || 'Failed to get response' },
      { status: 500 }
    )
  }
}