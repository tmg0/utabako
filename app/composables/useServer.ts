export enum ServerStatus {
  UNKNOWN = 'Unknown',
  ONLINE = 'Online',
  OFFLINE = 'Offline',
}

export interface UseServerStatusOptions {
  immediate: boolean
}

export function useServerStatus(value: MaybeRef<string>, options: UseServerStatusOptions = { immediate: true }) {
  const status = ref(ServerStatus.UNKNOWN)
  const server = computed(() => unref(value))

  async function execute() {
    status.value = await pingService(server.value) ? ServerStatus.ONLINE : ServerStatus.OFFLINE
  }

  watch(server, execute, options)

  return {
    status,
    execute,
  }
}

export function useServers() {
  const subscriptions = useTauriStorage<[string, SubscriptionOptions][]>('subscriptions', [], 'data.json')

  const servers = computed(() => subscriptions.value.map(([_, options]) => options.servers).flat().filter(Boolean))

  return {
    servers,
  }
}
