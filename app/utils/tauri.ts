import type { StorageLikeAsync } from '@vueuse/core'
import { defaultWindowIcon } from '@tauri-apps/api/app'
import { invoke } from '@tauri-apps/api/core'
import { appDataDir } from '@tauri-apps/api/path'
import { TrayIcon } from '@tauri-apps/api/tray'
import { LazyStore } from '@tauri-apps/plugin-store'
import { join } from 'pathe'

interface SystemProxy {
  is_enabled: boolean
  host: string
  port: number
  bypass: string
  protocol: string
}

const DEFAULTS_STORE: Record<string, any> = {
  log: {},
  dns: {},
  ntp: {},
  endpoints: [],

  inbounds: [{
    listen: '::',
    listen_port: DEFAULT_SING_BOX_INBOUND_PORT,
    type: 'mixed',
  }],

  outbounds: [],
  route: {},
  experimental: {},
}

let tray: TrayIcon

export function sleep(ms = 300) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export async function createTray() {
  if (tray)
    return tray

  const options = {
    icon: (await defaultWindowIcon()) ?? undefined,
  }

  tray = await TrayIcon.new(options)

  return tray
}

function isEmpty(value: any) {
  if (Array.isArray(value))
    return !value.length

  if (typeof value === 'object')
    return !!Object.keys(value).length

  return !value
}

export function until(value: () => any | Promise<any>, truthyValue: any = true, ms = 500, retries = 10): Promise<void> {
  return new Promise((resolve) => {
    let attempts = 1

    async function c() {
      const _v = await value()
      if (_v === truthyValue) {
        resolve()
      }
      else if (attempts < retries) {
        attempts++
        setTimeout(c, ms)
      }
      else {
        resolve()
      }
    }

    c()
  })
}

export function createTrauriStorage(path: string): StorageLikeAsync {
  const store = new LazyStore(path)

  return {
    async getItem(key) {
      const value = await store.get(key)
      return value as string
    },

    async setItem(key, value) {
      const defaults = DEFAULTS_STORE?.[key] ?? ''
      await store.set(key, isEmpty(value) ? defaults : value)
    },

    async removeItem(key) {
      await store.delete(key)
    },
  }
}

export function isSingBoxAvailable(port = DEFAULT_SING_BOX_INBOUND_PORT) {
  return pingService(['127.0.0.1', port].join(':'))
}

export function pingService(service: string) {
  return invoke<boolean>('plugin:health-check|ping', { service })
}

export function createSingBox() {
  return {
    async start() {
      await invoke<string>('plugin:sing-box|start', {
        config: join(await appDataDir(), 'config.json'),
      })
      await until(isSingBoxAvailable)
    },

    stop() {
      return invoke<string>('plugin:sing-box|stop')
    },
  }
}

export function createSystemProxy() {
  return {
    enable(protocol = 'socks') {
      return invoke('plugin:system-proxy|set', {
        isEnabled: true,
        port: DEFAULT_SING_BOX_INBOUND_PORT,
        protocol,
      })
    },

    disable() {
      return invoke('plugin:system-proxy|unset')
    },

    get() {
      return invoke<SystemProxy>('plugin:system-proxy|get')
    },
  }
}
