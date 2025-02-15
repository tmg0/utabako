export enum ServiceStatus {
  UNKNOWN = 'Unknown',
  ONLINE = 'Online',
  OFFLINE = 'Offline',
}

export interface UseServiceStatusOptions {
  immediate: boolean
}

export function useServiceStatus(value: MaybeRef<string>, options: UseServiceStatusOptions = { immediate: true }) {
  const status = ref(ServiceStatus.UNKNOWN)
  const service = computed(() => unref(value))

  async function execute() {
    status.value = await pingService(service.value) ? ServiceStatus.ONLINE : ServiceStatus.OFFLINE
  }

  watch(service, execute, options)

  return {
    status,
    execute,
  }
}
