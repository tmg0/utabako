import type { StorageLikeAsync } from '@vueuse/core'
import { invoke } from '@tauri-apps/api/core'
import { appDataDir } from '@tauri-apps/api/path'
import { LazyStore } from '@tauri-apps/plugin-store'
import { join } from 'pathe'

export function sleep(ms = 300) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
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
      await store.set(key, value)
    },

    async removeItem(key) {
      await store.delete(key)
    },
  }
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
      await until(() => this.isAvailable)
    },

    stop() {
      return invoke<string>('plugin:sing-box|stop')
    },

    get isAvailable() {
      return pingService(['127.0.0.1', DEFAULT_SING_BOX_INBOUND_PORT].join(':'))
    },
  }
}
