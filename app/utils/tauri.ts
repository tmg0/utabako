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

export function createSingBox() {
  return {
    async start() {
      return invoke<string>('plugin:sing-box|start', {
        config: join(await appDataDir(), 'config.json'),
      })
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
