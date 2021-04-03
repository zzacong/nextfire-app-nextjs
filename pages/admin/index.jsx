import { useContext, useState } from 'react'
import { useRouter } from 'next/router'
import kebabCase from 'lodash.kebabcase'
import toast, { Toaster } from 'react-hot-toast'
import { useCollection } from 'react-firebase-hooks/firestore'

import { UserContext } from '../../lib/context/UserContext'
import AuthCheck from '../../components/AuthCheck'
import Metatags from '../../components/Metatags'
import PostFeed from '../../components/PostFeed'
import { firestore, auth } from '../../lib/config/firebase'
import { serverTimestamp } from '../../lib/helpers/firebaseHelper'

export default function AdminPostPage() {
  return (
    <main>
      <Metatags title="Admin page" />
      <AuthCheck>
        <PostList />
        <CreateNewPost />
      </AuthCheck>
    </main>
  )
}

function PostList() {
  const ref = firestore
    .collection('users')
    .doc(auth.currentUser.uid)
    .collection('posts')
  const query = ref.orderBy('createdAt')
  const [querySnapshot] = useCollection(query)

  const posts = querySnapshot?.docs.map(doc => doc.data())

  return (
    <>
      <h1>Manage your Posts</h1>
      <PostFeed posts={posts} admin />
    </>
  )
}

function CreateNewPost() {
  const router = useRouter()
  const { username } = useContext(UserContext)
  const [title, setTitle] = useState('')

  // Ensure slug is URL safe
  const slug = encodeURI(kebabCase(title))
  const isValid = title.length > 3 && title.length < 100

  const createPost = async e => {
    e.preventDefault()
    const uid = auth.currentUser.uid
    const ref = firestore
      .collection('users')
      .doc(uid)
      .collection('posts')
      .doc(slug)

    // Tip: give all fields a default value here
    const data = {
      title,
      slug,
      uid,
      username,
      published: false,
      content: '# hello worlds!',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      heartCount: 0,
    }
    try {
      await ref.set(data)
      toast.success('Post created!')
      router.push(`/admin/${slug}`)
    } catch (error) {
      console.error(error)
      toast.error('Unexpected error occured.')
    }
  }

  return (
    <form onSubmit={createPost}>
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="My Awesome Article!"
      />
      <p>
        <strong>Slug:</strong> {slug}
      </p>
      <button type="submit" disabled={!isValid} className="btn-green">
        Create New Post
      </button>
      <Toaster />
    </form>
  )
}
