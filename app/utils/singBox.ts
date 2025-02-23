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
      await invoke.plugin.singBox.start({ config: join(await appDataDir(), 'config.json') })
      await until(() => this.available)
    },

    async stop() {
      await invoke.plugin.singBox.stop()
      await until(() => this.available, false)
    },

    elevatePrivileges: invoke.plugin.singBox.elevatePrivileges,

    get available() {
      return pingService(['127.0.0.1', DEFAULT_SING_BOX_INBOUND_PORT].join(':'))
    },
  }
}
