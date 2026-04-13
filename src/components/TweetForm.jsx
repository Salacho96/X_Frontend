import { useState } from 'react'
import api from '../api/axios'

export default function TweetForm({ onTweetCreated }) {
  const [content, setContent] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!content.trim()) return
    try {
      await api.post('/tweets/', { content })
      setContent('')
      setError('')
      if (onTweetCreated) onTweetCreated()
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating tweet')
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        maxLength={280}
        rows={3}
        placeholder="What's going on?"
        style={{ width: '100%', padding: '0.5rem' }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <small>{content.length}/280</small>
        <button type="submit" disabled={!content.trim()}>Tweet</button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  )
}