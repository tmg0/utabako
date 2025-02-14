import type { StorageLikeAsync } from '@vueuse/core'
import { invoke } from '@tauri-apps/api/core'
import { appDataDir } from '@tauri-apps/api/path'
import { LazyStore } from '@tauri-apps/plugin-store'
import { join } from 'pathe'

interface SystemProxy {
  isEnabled: boolean
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
    listen_port: 5129,
    type: 'mixed',
  }],

  outbounds: [],
  route: {},
  experimental: {},
}

function isEmpty(value: any) {
  if (Array.isArray(value))
    return !value.length

  if (typeof value === 'object')
    return !!Object.keys(value).length

  return !value
}

export function until(value: () => any | Promise<any>, truthyValue: any = true, ms = 500, retries = 3): Promise<void> {
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

function isPortAvailable() {
  return invoke<boolean>('plugin:port-plz|check', {
    port: 5129,
  })
}

export function createSingBox() {
  return {
    async start() {
      await invoke<string>('plugin:sing-box|start', {
        config: join(await appDataDir(), 'config.json'),
      })

      await until(isPortAvailable, false)
    },

    stop() {
      return invoke<string>('plugin:sing-box|stop')
    },
  }
}

export function createSystemProxy() {
  return {
    enable(protocol = 'socks') {
      return invoke('plugin:system-proxy|set', { isEnabled: true, protocol })
    },

    disable() {
      return invoke('plugin:system-proxy|unset')
    },

    get() {
      return invoke<SystemProxy>('plugin:system-proxy|get')
    },
  }
}
