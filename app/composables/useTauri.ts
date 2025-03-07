import { fetch } from '@tauri-apps/plugin-http'
import { createFetch } from '@vueuse/core'

export function useTauriStorage<T = unknown>(key: string, initialValue: T, file: string) {
  return useStorageAsync<T>(
    key,
    initialValue,
    createTauriStorage(file),
    {
      serializer: {
        read: (v: any) => v ?? undefined,
        write: (v: any) => v,
      },
    },
  )
}

export const useTauriFetch = createFetch({
  options: {
    fetch,
  },
})
