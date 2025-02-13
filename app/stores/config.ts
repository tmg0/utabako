interface Log {
  disabled: boolean
  level: 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'panic'
  output: string
  timestamp: boolean
}

export const useConfigStore = defineStore('config', () => {
  const log = useTauriStorage<Partial<Log>>('log', {}, 'config.json')
  const dns = useTauriStorage('dns', {}, 'config.json')
  const ntp = useTauriStorage('ntp', {}, 'config.json')
  const endpoints = useTauriStorage('endpoints', [], 'config.json')
  const inbounds = useTauriStorage('inbounds', [], 'config.json')
  const outbounds = useTauriStorage('outbounds', [], 'config.json')
  const route = useTauriStorage('route', {}, 'config.json')
  const experimental = useTauriStorage('experimental', {}, 'config.json')

  return {
    log,
    dns,
    ntp,
    endpoints,
    inbounds,
    outbounds,
    route,
    experimental
  }
})
