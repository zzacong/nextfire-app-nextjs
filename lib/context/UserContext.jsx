import { createContext } from 'react'
import useUserData from '../hooks/useUserData'

export const UserContext = createContext({ user: null, username: null })

export default function UserProvider({ children }) {
  const { user, username } = useUserData()

  return (
    <UserContext.Provider value={{ user, username }}>
      {children}
    </UserContext.Provider>
  )
}
