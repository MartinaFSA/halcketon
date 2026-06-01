process.stdin.setEncoding('utf8')
let input = ''
process.stdin.on('data', (d) => (input += d))
process.stdin.on('end', () => {
  const toolArgs = JSON.parse(input)
  const filePath = toolArgs.tool_input?.file_path || ''
  const command = toolArgs.tool_input?.command || ''
  if (filePath.includes('.env') || command.includes('.env')) {
    console.error('You cannot access the .env file')
    process.exit(2)
  }
  process.exit(0)
})
