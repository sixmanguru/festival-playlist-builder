export async function onRequestPost({ request, env }) {
  let body
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { festival, location, email } = body

  if (!festival?.trim() || !location?.trim() || !email?.trim()) {
    return Response.json({ error: 'All fields are required' }, { status: 400 })
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: 'Invalid email address' }, { status: 400 })
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Strange Trip <onboarding@resend.dev>',
      to: [env.NOTIFY_EMAIL],
      subject: `Festival Request: ${festival.trim()}`,
      html: `
        <h2>New Festival Request</h2>
        <p><strong>Festival:</strong> ${festival.trim()}</p>
        <p><strong>Location:</strong> ${location.trim()}</p>
        <p><strong>Notify when added:</strong> ${email.trim()}</p>
      `,
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    console.error('Resend error:', err)
    return Response.json({ error: 'Failed to send request. Please try again.' }, { status: 500 })
  }

  return Response.json({ ok: true })
}
