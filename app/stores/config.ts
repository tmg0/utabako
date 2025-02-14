interface Log {
  disabled: boolean
  level: 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'panic'
  output: string
  timestamp: boolean
}

export interface VmessOutbound {
  type: 'vmess'
  server: string
  server_port: number
  uuid: string
  security: string
  alter_id: number
}

export interface ShadowsocksOutbound {
  type: 'shadowsocks'
  server: string
  server_port: number
  method: string
  password: string
}

interface Inbound {
  listen: string
  listen_port: number
  type: 'mixed'
}

export type Outbound = ShadowsocksOutbound | VmessOutbound

export const useConfigStore = defineStore('config', () => {
  const log = useTauriStorage<Partial<Log>>('log', {}, 'config.json')
  const dns = useTauriStorage('dns', {}, 'config.json')
  const ntp = useTauriStorage('ntp', {}, 'config.json')
  const endpoints = useTauriStorage('endpoints', [], 'config.json')
  const inbounds = useTauriStorage<Inbound[]>('inbounds', [], 'config.json')
  const outbounds = useTauriStorage<Outbound[]>('outbounds', [], 'config.json')
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
    experimental,
  }
})
