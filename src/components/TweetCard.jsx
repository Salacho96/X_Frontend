import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

export default function TweetCard({ tweet, onDelete, onLike }) {
  const [likes, setLikes] = useState(tweet.likes_count)
  const [liked, setLiked] = useState(tweet.liked_by_me)

  const handleLike = async () => {
    await api.post(`/tweets/${tweet.id}/like/`)
    setLiked(!liked)
    setLikes(liked ? likes - 1 : likes + 1)
    if (onLike) onLike()
  }

  const handleDelete = async () => {
    if (!window.confirm('¿Eliminar tweet?')) return
    await api.delete(`/tweets/${tweet.id}/`)
    if (onDelete) onDelete(tweet.id)
  }

  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', margin: '0.5rem 0' }}>
      <Link to={`/profile/${tweet.author.username}`}>
        <strong>@{tweet.author.username}</strong>
      </Link>
      <p>{tweet.content}</p>
      <small>{new Date(tweet.created_at).toLocaleString()}</small>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
        <button onClick={handleLike}>{liked ? '❤️' : '🤍'} {likes}</button>
        {onDelete && <button onClick={handleDelete}>🗑️ Eliminar</button>}
      </div>
    </div>
  )
}