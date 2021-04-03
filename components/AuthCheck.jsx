import { useContext } from 'react'
import NextLink from 'next/link'
import { UserContext } from '../lib/context/UserContext'

export default function AuthCheck({ children, fallback }) {
  const { username } = useContext(UserContext)

  return username
    ? children
    : fallback || <NextLink href="/enter">You must be signed in.</NextLink>
}
