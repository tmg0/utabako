import { invoke } from '@tauri-apps/api/core'
import { appDataDir } from '@tauri-apps/api/path'
import { join } from 'pathe'

export function defineSingBoxOutbound<T = Outbound>(outbound: Outbound): T {
  return {
    tag: 'proxy',
    ...outbound,
  } as T
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
