const GIST_FILE = 'habits.json'
export const HABITS_GIST_ID = 'ba2cb630ca10ab7f8668fa8863935495'
const QUOTES_GIST_ID = 'fc819d0675ae05e2d5da1df4975bd806'

export async function fetchRandomQuote() {
  const res = await fetch(`https://api.github.com/gists/${QUOTES_GIST_ID}`, {
    headers: { Accept: 'application/vnd.github.v3+json' },
  })
  if (!res.ok) return null
  const gist = await res.json()
  const file = Object.values(gist.files)[0]
  const quotes = JSON.parse(file.content)
  return quotes[Math.floor(Math.random() * quotes.length)]
}

export async function readGist(gistId) {
  const res = await fetch(`https://api.github.com/gists/${gistId}`, {
    headers: { Accept: 'application/vnd.github.v3+json' },
  })
  if (!res.ok) throw new Error(`Failed to read gist: ${res.status}`)
  const gist = await res.json()
  const content = gist.files?.[GIST_FILE]?.content
  return content ? JSON.parse(content) : {}
}

export async function writeGist(gistId, token, data) {
  const res = await fetch(`https://api.github.com/gists/${gistId}`, {
    method: 'PATCH',
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      files: {
        [GIST_FILE]: {
          content: JSON.stringify(data, null, 2),
        },
      },
    }),
  })
  if (!res.ok) throw new Error(`Failed to write gist: ${res.status}`)
  return res.json()
}
