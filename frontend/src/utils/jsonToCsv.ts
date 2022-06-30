export default function convertJsonToCsv(json: any): string {
  if (!Array.isArray(json) || !json.every((p) => typeof p === 'object' && p !== null)) {
    return ''
  }

  const heading = Object.keys(json[0]).join(',').concat('\n')
  const body = json
    .map((o) =>
      Object.values(o)
        .map((v) => v || 'null')
        .join(','),
    )
    .join('\n')
  return `${heading}${body}`
}
