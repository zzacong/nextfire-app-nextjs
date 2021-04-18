import NextLink from 'next/link'

export default function Custom404() {
  return (
    <main>
      <h1>404 - That page does not seem to exists...</h1>
      <iframe
        src="https://giphy.com/gifs/14uQ3cOFteDaU/html5"
        width="480"
        height="365"
        frameBorder="0"
        allowFullScreen
      ></iframe>
      <NextLink href="/">
        <button className="btn-blue">Go home</button>
      </NextLink>
    </main>
  )
}
