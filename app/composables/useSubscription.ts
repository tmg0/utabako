import { useFetch } from '@vueuse/core'

export function useSubscription() {
  const url = ref('')
  const { data, execute } = useFetch(url.value, { immediate: false }).get().text()

  const servers = computed(() => {
    return []
  })

  return {
    url,
    servers,
    execute,
  }
}
