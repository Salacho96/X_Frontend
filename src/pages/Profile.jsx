import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import TweetCard from '../components/TweetCard'

export default function Profile() {
  const { username } = useParams()
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [tweets, setTweets] = useState([])
  const [following, setFollowing] = useState(false)
  const [editingBio, setEditingBio] = useState(false)
  const [bio, setBio] = useState('')

  const fetchProfile = async () => {
    const res = await api.get(`/auth/profile/${username}/`)
    setProfile(res.data.data)
    setBio(res.data.data.bio)
  }

  const fetchTweets = async () => {
    const res = await api.get('/tweets/')
    setTweets(res.data.data.tweets)
  }

  const fetchFollowing = async () => {
    const res = await api.get(`/auth/profile/${user.username}/following/`)
    const isFollowing = res.data.data.some(u => u.username === username)
    setFollowing(isFollowing)
  }

  useEffect(() => {
    fetchProfile()
    fetchTweets()
    if (user.username !== username) fetchFollowing()
  }, [username])

  const handleFollow = async () => {
    await api.post(`/auth/profile/${username}/follow/`)
    setFollowing(!following)
    fetchProfile()
  }

  const handleDelete = (id) => {
    setTweets(tweets.filter(t => t.id !== id))
  }

  const handleSaveBio = async () => {
    await api.put(`/auth/profile/${username}/`, { bio })
    setEditingBio(false)
    fetchProfile()
  }

  if (!profile) return <p>Loading...</p>

  return (
    <div style={{ maxWidth: '600px', margin: '1rem auto', padding: '1rem' }}>
      <h2>@{profile.username}</h2>

      {user.username === username ? (
        editingBio ? (
          <div>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              style={{ width: '100%', padding: '0.5rem' }}
            />
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button onClick={handleSaveBio}>Save</button>
              <button onClick={() => setEditingBio(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <div>
            <p>{profile.bio || 'Sin bio'}</p>
            <button onClick={() => setEditingBio(true)}>✏️ Edit bio</button>
          </div>
        )
      ) : (
        <p>{profile.bio || 'Sin bio'}</p>
      )}

      <p>👥 {profile.followers_count} followers · {profile.following_count} following</p>

      {user.username !== username && (
        <button onClick={handleFollow}>
          {following ? 'Unfollow' : 'Follow'}
        </button>
      )}

      <hr />
      <h3>Tweets</h3>
      {tweets.map(tweet => (
        <TweetCard
          key={tweet.id}
          tweet={tweet}
          onDelete={user.username === username ? handleDelete : null}
        />
      ))}
    </div>
  )
}