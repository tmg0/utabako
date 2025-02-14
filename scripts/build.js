import { platform } from 'node:process'
import { execa } from 'execa'

async function run() {
  const ext = platform === 'win32' ? '.exe' : ''
  const { stdout } = await execa('rustc', ['-vV'])
  const targetTriple = /host: (\S+)/.exec(stdout)[1]

  execa('nuxt', ['generate'], { stdio: 'inherit'})
  execa('make', [`OUTPUT=../src-tauri/binaries/sing-box-${targetTriple}${ext}`], {  stdio: 'inherit', cwd: './sing-box' })
}

run()
