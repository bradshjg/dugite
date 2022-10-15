import { GitProcess } from 'dugite'

const git = GitProcess

async function checkStatusExec(path) {
  console.log(`Checking status of ${path} with exec`)
  const result = await git.exec(['status'], path)
  console.log(result.stdout)
}

async function checkStatusSpawn(path) {
  console.log(`Checking status of ${path} with spawn`)
  const process = git.spawn(['status'], path)
  process.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  process.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  process.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });
}

const path = process.argv[2]
console.log(`Using path: ${path}\n`)
await checkStatusExec(path)
await checkStatusSpawn(path)
