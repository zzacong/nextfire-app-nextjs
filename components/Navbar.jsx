import NextLink from 'next/link'
import { useContext } from 'react'
import { UserContext } from '../lib/context/UserContext'

export default function Navbar() {
  const { user, username } = useContext(UserContext)

  return (
    <nav className="navbar">
      <ul>
        <li>
          <NextLink href="/">
            <button className="btn-logo">FEED</button>
          </NextLink>
        </li>
        {username ? (
          <>
            <li className="push-left">
              <NextLink href="/admin">
                <button className="btn-blue">Write Posts</button>
              </NextLink>
            </li>
            <li>
              <NextLink href={`/${username}`}>
                <img
                  src={user?.photoURL || '/hacker.png'}
                  alt="Profile image"
                />
              </NextLink>
            </li>
          </>
        ) : (
          <NextLink href="/enter">
            <button className="btn-blue">Log in</button>
          </NextLink>
        )}
      </ul>
    </nav>
  )
}
