import { appDataDir } from '@tauri-apps/api/path'
import { join } from 'pathe'

export interface Log {
  disabled?: boolean
  level?: 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'panic'
  output?: string
  timestamp?: boolean
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

export type Outbound = ShadowsocksOutbound | VmessOutbound

export interface Inbound {
  listen: string
  listen_port: number
  type: 'mixed'
}

const DEFAULT_INBOUNDS: Inbound[] = [{
  listen: '::',
  listen_port: DEFAULT_SING_BOX_INBOUND_PORT,
  type: 'mixed',
}]

export function useSingBox() {
  const service = createSingBox()
  const proxy = createSystemProxy()
  const store = useGlobalStore()
  const { isConnected } = storeToRefs(store)

  const isLoading = ref(false)
  const isAvailable = ref(service.isAvailable)

  async function enable() {
    isLoading.value = true
    await Promise.all([
      service.start(),
      proxy.enable(),
    ])
    isLoading.value = false
  }

  async function disable() {
    isLoading.value = true
    await Promise.all([
      service.stop(),
      proxy.disable(),
    ])
    isLoading.value = false
  }

  async function restart() {
    if (!isConnected.value)
      return
    isLoading.value = true
    await service.stop()
    await service.start()
    isLoading.value = false
  }

  return {
    isLoading,
    isAvailable,
    enable,
    disable,
    restart,
  }
}

export function useSingBoxConfig() {
  const log = useTauriStorage<Log>('log', {}, 'config.json')
  const dns = useTauriStorage('dns', {}, 'config.json')
  const ntp = useTauriStorage('ntp', {}, 'config.json')
  const endpoints = useTauriStorage('endpoints', [], 'config.json')
  const inbounds = useTauriStorage<Inbound[]>('inbounds', DEFAULT_INBOUNDS, 'config.json')
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
}

export function useSingBoxLog(log: Ref<Log>) {
  const disabled = ref(false)
  const level = ref<Log['level']>('info')
  const timestamp = ref(true)
  const output = ref('')
  const text = ref('')

  const options = computed<Log>(() => ({
    disabled: disabled.value,
    level: level.value,
    output: output.value,
    timestamp: timestamp.value,
  }))

  async function setup() {
    if (!Object.keys(log?.value ?? {}).length)
      output.value = join(await appDataDir(), 'box.log')
    log.value = options.value
  }

  setup()

  return {
    disabled,
    level,
    output,
    timestamp,
    text,
  }
}
