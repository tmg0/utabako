import type { StorageLikeAsync } from '@vueuse/core'
import { invoke as tauriInvoke } from '@tauri-apps/api/core'
import { LazyStore } from '@tauri-apps/plugin-store'

export function sleep(ms = 300) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export function until(value: () => any | Promise<any>, truthyValue: any = true, ms = 500, retries = 60 * 1000 / 500): Promise<void> {
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
        throw TIMEOUT
      }
    }

    c()
  })
}

export function createTauriStorage(path: string): StorageLikeAsync {
  const store = new LazyStore(path)

  return {
    async getItem(key) {
      const value = await store.get(key)
      return value as string
    },

    async setItem(key, value) {
      await store.set(key, value)
    },

    async removeItem(key) {
      await store.delete(key)
    },
  }
}

export const invoke = {
  plugin: {
    tray: {
      enable: () => tauriInvoke<boolean>('plugin:utray|enable'),
      disable: () => tauriInvoke<boolean>('plugin:utray|disable'),
    },

    singBox: {
      start: (options: { config: string }) => tauriInvoke('plugin:sing-box|start', options),
      stop: () => tauriInvoke('plugin:sing-box|stop'),
      elevatePrivileges: () => tauriInvoke('plugin:sing-box|elevate_privileges'),
    },

    healthCheck: {
      ping: (options: { service: string }) => tauriInvoke<boolean>('plugin:health-check|ping', options),
    },
  },
}

export function pingService(service: string) {
  return tauriInvoke<boolean>('plugin:health-check|ping', { service })
}
