import NextLink from 'next/link'
import ReactMarkDown from 'react-markdown'

export default function PostContent({ post }) {
  const createdAt =
    typeof post?.createdAt === 'number'
      ? new Date(post.createdAt)
      : post.createdAt

  return (
    <div className="card">
      <h1>{post?.title}</h1>
      <span className="text-sm">
        Written by{' '}
        <NextLink href={`/${post.username}/`}>
          <a className="text-info">@{post.username}</a>
        </NextLink>{' '}
        on {createdAt.toISOString()}
      </span>
      <ReactMarkDown>{post?.content}</ReactMarkDown>
    </div>
  )
}
