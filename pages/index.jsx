import Head from 'next/head'
import { useState } from 'react'
import Loader from '../components/Loader'
import PostFeed from '../components/PostFeed'
import { firestore } from '../lib/config/firebase'
import { fromMillis, postToJSON } from '../lib/helpers/firebaseHelper'

const LIMIT = 1

export default function Home(props) {
  const [posts, setPosts] = useState(props.posts)
  const [loading, setLoading] = useState(false)
  const [postsEnd, setPostsEnd] = useState(false)

  const getMorePosts = async () => {
    setLoading(true)
    const last = posts[posts.length - 1]
    if (!last) {
      setLoading(false)
      return setPostsEnd(true)
    }
    const cursor =
      typeof last.createdAt === 'number'
        ? fromMillis(last.createdAt)
        : last.createdAt

    const query = firestore
      .collectionGroup('posts')
      .where('published', '==', true)
      .orderBy('createdAt', 'desc')
      .startAfter(cursor)
      .limit(LIMIT)

    const newPosts = (await query.get()).docs.map(doc => doc.data())

    setPosts(prev => [...prev, ...newPosts])
    setLoading(false)

    if (newPosts.length < LIMIT) {
      setPostsEnd(true)
    }
  }

  return (
    <main>
      <Head>
        <title>NextFire App | Nextjs</title>
      </Head>

      <PostFeed posts={posts} />
      {!loading && !postsEnd && (
        <button onClick={getMorePosts}>Load more</button>
      )}
      <Loader show={loading} />

      {postsEnd && <p>'You have reached the end!'</p>}
    </main>
  )
}

export async function getServerSideProps() {
  const postsQuery = firestore
    .collectionGroup('posts')
    .where('published', '==', true)
    .orderBy('createdAt', 'desc')
    .limit(LIMIT)

  const posts = (await postsQuery.get()).docs.map(postToJSON)

  return {
    props: { posts },
  }
}
