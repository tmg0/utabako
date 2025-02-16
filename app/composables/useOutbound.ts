export function useOutbound(value: MaybeRef<Outbound | undefined>) {
  const outbound = computed(() => unref(value))

  const host = computed(() => {
    const v = [
      outbound.value?.server,
      outbound.value?.server_port,
    ].filter(Boolean)

    if (v.length) {
      return v.join(':')
    }
  })

  return {
    host,
  }
}
