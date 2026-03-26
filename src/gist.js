const GIST_FILE = 'habits.json'

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
