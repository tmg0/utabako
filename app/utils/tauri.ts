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

export function createTrauriStorage(path: string): StorageLikeAsync {
  const store = new LazyStore(path)

  return {
    async getItem(key) {
      const value = await store.get<string>(key) ?? ''
      return value
    },

    async setItem(key, value) {
      await store.set(key, value)
    },

    async removeItem(key) {
      await store.delete(key)
    },
  }
}

export function createSingBox() {
  return {
    async start() {
      invoke<string>('plugin:sing-box|start', {
        config: join(await appDataDir(), 'config.json'),
      })
    },

    stop() {
      invoke<string>('plugin:sing-box|stop')
    },
  }
}

export function toggleSystemProxyStatus(isEnabled: boolean, protocol = 'socks') {
  if (isEnabled)
    invoke('plugin:system-proxy|set', { isEnabled, protocol })
  else
    invoke('plugin:system-proxy|unset')
}

export async function loadSystemProxySettings() {
  return invoke<SystemProxy>('plugin:system-proxy|get')
}
