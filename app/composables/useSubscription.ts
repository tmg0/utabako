import { destr } from 'destr'

interface SubmitOptions {
  afterSubmit: () => void
}

export interface SubscriptionOptions {
  servers: Outbound[]
}

const parser = {
  shadowsocks(value: string): ShadowsocksOutbound | undefined {
    try {
      const [encode] = value.replace('ss://', '').split('#') as [string]
      const [method, password, server, port] = atob(encode).split(/:|@/)

      if (server && server && method && password) {
        return {
          type: 'shadowsocks',
          server,
          server_port: Number(port),
          method,
          password,
        }
      }
    }
    catch {
      return undefined
    }
  },

  vmess(value: string): VmessOutbound | undefined {
    try {
      const [encode] = value.replace('vmess://', '').split('#') as [string]
      const { add, port, id, aid } = destr<Record<string, any>>(atob(encode))
      const security = 'aes-128-gcm'

      if (add && port && id) {
        return {
          type: 'vmess',
          server: add,
          server_port: Number(port),
          uuid: id,
          security,
          alter_id: Number(aid ?? 0),
        }
      }
    }
    catch {
      return undefined
    }
  },
}

export function useSubscription() {
  const url = ref('')
  const { data, isFetching, execute } = useTauriFetch(url, { immediate: false }).get().text()
  const store = useConfigStore()
  const { outbounds } = storeToRefs(store)
  const subscriptions = useTauriStorage<[string, SubscriptionOptions][]>('subscriptions', [], 'data.json')

  const servers = computed(() => {
    if (!data.value)
      return []

    try {
      const decode = atob(data.value)

      const outbounds: (Outbound | undefined)[] = decode.split('\n').map((url) => {
        if (url.startsWith('ss'))
          return parser.shadowsocks(url)
        if (url.startsWith('vmess'))
          return parser.vmess(url)

        return undefined
      }).filter(Boolean)

      return outbounds as Outbound[]
    }
    catch {
      return []
    }
  })

  async function submit({ afterSubmit }: Partial<SubmitOptions> = {}) {
    if (!url.value)
      return

    await execute()

    if (!servers.value.length)
      return

    const cached = subscriptions.value || []
    const index = cached.findIndex(([value]) => value === url.value)

    if (index > -1)
      subscriptions.value[index]![1].servers = servers.value
    else
      subscriptions.value = [...subscriptions.value, [url.value, { servers: servers.value }]]

    outbounds.value = [servers.value[0]!]
    url.value = ''
    afterSubmit?.()
  }

  return {
    url,
    servers,
    isFetching,
    submit,
  }
}
