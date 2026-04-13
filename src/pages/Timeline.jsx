import { useEffect, useState } from 'react'
import api from '../api/axios'
import TweetCard from '../components/TweetCard'
import TweetForm from '../components/TweetForm'

export default function Timeline() {
  const [tweets, setTweets] = useState([])
  const [page, setPage] = useState(1)
  const [hasNext, setHasNext] = useState(false)

  const fetchTimeline = async (p = 1) => {
    const res = await api.get(`/tweets/timeline/?page=${p}`)
    const data = res.data.data
    setTweets(p === 1 ? data.tweets : [...tweets, ...data.tweets])
    setHasNext(data.has_next)
    setPage(p)
  }

  useEffect(() => { fetchTimeline() }, [])

  return (
    <div style={{ maxWidth: '600px', margin: '1rem auto', padding: '1rem' }}>
      <h2>Timeline</h2>
      <TweetForm onTweetCreated={() => fetchTimeline(1)} />
      {tweets.length === 0 && <p>No tweets. keep going!</p>}
      {tweets.map(tweet => (
        <TweetCard key={tweet.id} tweet={tweet} />
      ))}
      {hasNext && (
        <button onClick={() => fetchTimeline(page + 1)}>Load More</button>
      )}
    </div>
  )
}