import { useState } from 'react'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import { useForm } from 'react-hook-form'
import ReactMarkdown from 'react-markdown'
import toast, { Toaster } from 'react-hot-toast'

import styles from '../../styles/Admin.module.css'
import AuthCheck from '../../components/AuthCheck'
import { auth, firestore } from '../../lib/config/firebase'
import { serverTimestamp } from '../../lib/helpers/firebaseHelper'

export default function AdminPostEdit() {
  return (
    <AuthCheck>
      <PostManager />
    </AuthCheck>
  )
}

function PostManager() {
  const [preview, setPreview] = useState(false)
  const router = useRouter()
  const { slug } = router.query

  const postRef = firestore
    .collection('users')
    .doc(auth.currentUser.uid)
    .collection('posts')
    .doc(slug)
  const [post] = useDocumentData(postRef)

  return (
    <main className={styles.container}>
      {post && (
        <>
          <section>
            <h1>{post.title}</h1>
            <p>ID: {post.slug}</p>
            <PostForm
              postRef={postRef}
              defaultValues={post}
              preview={preview}
            />
          </section>
          <aside>
            <h3>Tools</h3>
            <button onClick={() => setPreview(prev => !prev)}>
              {preview ? 'Edit' : 'Preview'}
            </button>
            <NextLink href={`/${post.username}/${post.slug}`}>
              <button className="btn-blue">Live view</button>
            </NextLink>
          </aside>
        </>
      )}
    </main>
  )
}

function PostForm({ postRef, defaultValues, preview }) {
  const { handleSubmit, register, reset, watch, formState } = useForm({
    defaultValues,
    mode: 'onChange',
  })

  const { isValid, isDirty, errors } = formState

  const updatePost = async ({ content, published }) => {
    try {
      await postRef.update({
        content,
        published,
        updatedAt: serverTimestamp(),
      })
      reset({ content, published })
      toast.success('Post updated succesfully')
    } catch (error) {
      console.error(error)
      toast.error('Unexpected error occured.')
    }
  }

  return (
    <form onSubmit={handleSubmit(updatePost)}>
      {preview && (
        <div className="card">
          <ReactMarkdown>{watch('content')}</ReactMarkdown>
        </div>
      )}

      <div className={preview ? styles.hidden : styles.controls}>
        <textarea
          {...register('content', {
            maxLength: { value: 20000, message: 'content is too long' },
            minLength: { value: 10, message: 'content is too short' },
            required: 'content is required',
          })}
        ></textarea>
        {errors.content && (
          <p className="text-danger">{errors.content.message}</p>
        )}

        <fieldset>
          <input
            className={styles.checkbox}
            type="checkbox"
            {...register('published')}
          />
          <label>Published</label>
        </fieldset>

        <button
          type="submit"
          className="btn-green"
          disabled={!isDirty || !isValid}
        >
          Save Changes
        </button>
      </div>
      <Toaster />
    </form>
  )
}
