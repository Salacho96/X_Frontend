import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

export default function Search() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])

  const handleSearch = async (e) => {
    const q = e.target.value
    setQuery(q)
    if (!q.trim()) { setResults([]); return }
    const res = await api.get(`/search/users/?q=${q}`)
    setResults(res.data.data)
  }

  return (
    <div style={{ maxWidth: '600px', margin: '1rem auto', padding: '1rem' }}>
      <h2>Buscar usuarios</h2>
      <input
        type="text"
        placeholder="Buscar por username..."
        value={query}
        onChange={handleSearch}
        style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
      />
      {results.length === 0 && query && <p>No se encontraron usuarios.</p>}
      {results.map(user => (
        <div key={user.id} style={{ border: '1px solid #ccc', padding: '0.5rem', margin: '0.5rem 0' }}>
          <Link to={`/profile/${user.username}`}>
            <strong>@{user.username}</strong>
          </Link>
          <p>{user.bio || 'Sin bio'}</p>
          <small>{user.followers_count} followers</small>
        </div>
      ))}
    </div>
  )
}