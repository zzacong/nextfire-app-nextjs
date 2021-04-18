import Head from 'next/head'
import Navbar from '@components/Navbar'
import UserProvider from '@lib/context/UserContext'
import '@styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <UserProvider>
        <Navbar />
        <Component {...pageProps} />
      </UserProvider>
    </>
  )
}

export default MyApp
