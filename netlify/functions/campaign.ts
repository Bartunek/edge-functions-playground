import { Handler } from '@netlify/functions'
import cookie from 'cookie'

const handler: Handler = async (event, context) => {
  if (!event.queryStringParameters) {
    return {
      statusCode: 504,
      body: "Bad request"
    }
  }
  const url = event.queryStringParameters.url
  const campaign = event.queryStringParameters.campaign || 'test'

  console.log({ url, campaign })

  const hour = 3600000
  const twoWeeks = 14 * 24 * hour
  const myCookie = cookie.serialize('nf_ab', campaign, {
    secure: true,
    httpOnly: true,
    path: '/',
    maxAge: twoWeeks,
  })
  // Do redirects via html
  const html = `
  <html lang="en">
    <head>
      <meta charset="utf-8">
    </head>
    <body>
      <noscript>
        <meta http-equiv="refresh" content="0; url=${url}" />
      </noscript>
    </body>
    <script>
      setTimeout(function() {
        window.location.href = ${JSON.stringify(url)}
      }, 0)
    </script>
  </html>`

  return {
    'statusCode': 200,
    'headers': {
      'Set-Cookie': myCookie,
      'Cache-Control': 'no-cache',
      'Content-Type': 'text/html',
    },
    'body': html
  }
}

export { handler }
