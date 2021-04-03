import { useEffect, useState, useContext, useCallback } from 'react'
import { debounce } from 'lodash'
import { auth, firestore, googleAuthProvider } from '../lib/config/firebase'
import { UserContext } from '../lib/context/UserContext'

export default function EnterPage({}) {
  const { user, username } = useContext(UserContext)

  return (
    <main>
      {user ? (
        !username ? (
          <UsernameForm />
        ) : (
          <SignOutButton />
        )
      ) : (
        <SignInButton />
      )}
    </main>
  )
}

// Sign in with Google button
function SignInButton() {
  const signInWithGoogle = async () => {
    try {
      await auth.signInWithPopup(googleAuthProvider)
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <button className="btn-google" onClick={signInWithGoogle}>
      <img src={'/google.png'} /> Sign in with Google
    </button>
  )
}

function SignOutButton() {
  return <button onClick={() => auth.signOut()}>Sign Out</button>
}

function UsernameForm() {
  const [formValue, setFormValue] = useState('')
  const [isValid, setIsValid] = useState(false)
  const [loading, setLoading] = useState(false)
  const { user, username } = useContext(UserContext)

  const onSubmit = async e => {
    e.preventDefault()
    const userDoc = firestore.doc(`users/${user.uid}`)
    const usernameDoc = firestore.doc(`usernames/${formValue}`)

    const batch = firestore.batch()
    batch.set(userDoc, {
      username: formValue,
      photoURL: user.photoURL,
      displayName: user.displayName,
    })
    batch.set(usernameDoc, { uid: user.uid })
    try {
      await batch.commit()
    } catch (error) {
      console.error(error)
    }
  }

  const onChange = ({ target }) => {
    const val = target.value.toLowerCase()
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/

    if (val.length < 3) {
      setFormValue(val)
      setLoading(false)
      setIsValid(false)
    }

    if (re.test(val)) {
      setFormValue(val)
      setLoading(true)
      setIsValid(false)
    }
  }

  // hit the database for username match after each debounce change
  // useCallback is required for debounce to work
  const checkUsername = useCallback(
    debounce(async username => {
      if (username.length >= 3) {
        const ref = firestore.doc(`usernames/${username}`)
        const { exists } = await ref.get()
        console.log('Firestore read executed')
        setIsValid(!exists)
        setLoading(false)
      }
    }, 500),
    []
  )

  useEffect(() => {
    checkUsername(formValue)
  }, [formValue])

  return (
    !username && (
      <section>
        <h3>Choose Username</h3>
        <form onSubmit={onSubmit}>
          <input
            name="username"
            type="text"
            placeholder="username"
            value={formValue}
            onChange={onChange}
          />

          <UsernameMessage
            username={username}
            isValid={isValid}
            loading={loading}
          />

          <button type="submit" className="btn-green" disabled={!isValid}>
            Choose
          </button>

          <h3>Debug state</h3>
          <div>
            Username: {formValue}
            <br />
            Loading: {loading.toString()}
            <br />
            Username Valid: {isValid.toString()}
          </div>
        </form>
      </section>
    )
  )
}

function UsernameMessage({ username, isValid, loading }) {
  if (loading) {
    return <p>Checking</p>
  } else if (isValid) {
    return <p className="text-success">{username} is available!</p>
  } else if (username && !isValid) {
    return <p className="text-danger">That username is taken!</p>
  } else {
    return null
  }
}
