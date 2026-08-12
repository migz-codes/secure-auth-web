export const dedent = (value: string) => {
  const lines = value.split('\n')

  const indents = lines
    .filter((line) => line.trim())
    .map((line) => line.length - line.trimStart().length)

  const indent = Math.min(...indents)

  return lines
    .map((line) => line.slice(indent))
    .join('\n')
    .trim()
}
