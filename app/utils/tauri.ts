import type { StorageLikeAsync } from '@vueuse/core'
import { invoke } from '@tauri-apps/api/core'
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

export function pingService(service: string) {
  return invoke<boolean>('plugin:health-check|ping', { service })
}
