import * as fs from 'fs'

import { request } from 'http'
import { ExecOptions, ChildProcess, execFile } from 'child_process'

export function remoteExecFile(_: string, args: string[], options: ExecOptions, cb: (error: Error | null, stdout: string, stderr: string) => void): ChildProcess {
  httpRequest(args, options).then((result) => {
    const stdout = result.stdout
    const stderr = result.stderr
    let error = result.error
    if (error) {
      error = new ExecFileError(JSON.stringify(error), error.code)
    }
    cb(error, stdout, stderr)
  })
  return execFile('true')
}

class ExecFileError extends Error {
  public code: string

  constructor(message: string, code: string) {
    super(message)
    this.name = 'ExecFileError'
    this.code = code
  }
}

function httpRequest(args: string[], options: ExecOptions): Promise<any> {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({'args': args, 'options': options})
    const postOptions = {
      host: 'localhost',
      port: '8000',
      path: '/',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }
    const req = request(postOptions, (res) => {
      res.setEncoding('utf8');
      let data = ''
      res.on('data', (chunk) => {
        data += chunk
      })
      res.on('end', () => {
        fs.writeFileSync(
            '/tmp/server_response.txt',
            data + '\n\n\n\n',
            { encoding: 'utf8', flag: 'a'}
          )
        resolve(JSON.parse(data))
      })
    })
    req.on('error', (e) => {
      console.error(`problem with request: ${e.message}`)
      reject(e)
    })
    req.write(postData)
    req.end()
  })
}
