import { execFile } from 'child_process'
import { createServer } from 'http'

// create a server
const server = createServer((request, response) => {
  // parse request to json
  let body = ''
  request.on('data', chunk => {
    body += chunk
  })
  request.on('end', () => {
    // verify POST
    if (request.method !== 'POST') {
      response.statusCode = 400
      response.end()
    } else {
    // parse json
    const data = JSON.parse(body)
    console.log(`got request: ${body}`)
    // execute command
    execFile('git', data.args, data.options, (error, stdout, stderr) => {
      // send response
      response.writeHead(200, {'Content-Type': 'application/json'})
      console.log(`sent stdout: ${stdout}`)
      response.end(JSON.stringify({
        error: error,
        stdout: stdout,
        stderr: stderr
      }), () => { console.log(`sent stdout: ${stdout}`) })
    })
  }})
})

console.log('listening on port 8000')
server.listen(8000)
