<script setup lang="ts">
definePageMeta({
  keepalive: true,
})

let originIndex: string

const configStore = useConfigStore()
const globalStore = useGlobalStore()
const { outbounds } = storeToRefs(configStore)
const { servers, isConnected } = storeToRefs(globalStore)
const outbound = computed(() => outbounds.value?.[0])
const selected = ref<string>()
const { isLoading, restart } = useSingBox()
const router = useRouter()

const hosts = computed(() => servers.value.map(host))
const outboundHost = computed(() => host(outbound.value))

const unwatch = watchImmediate(hosts, (value) => {
  originIndex = value.findIndex(h => h === outboundHost.value).toString()
  selected.value = originIndex
})

function host(value?: ProxyOutbound) {
  const a = [
    value?.server,
    value?.server_port,
  ].filter(Boolean)

  if (a.length) {
    return a.join(':')
  }
}

async function onUpldate(value: string) {
  unwatch()
  if (originIndex === value)
    return
  const index = Number(value)
  const server = servers.value[index] as ProxyOutbound
  if (server)
    outbounds.value = [server]
  await restart()
  if (isConnected.value)
    router.replace({ name: 'index' })
  selected.value = value
}
</script>

<template>
  <div class="p-5 text-xs">
    <RadioGroup :model-value="selected" :disabled="isLoading" @update:model-value="onUpldate">
      <ServerRadioGroup v-for="(item, index) in hosts" :key="index" :label="item" :value="index" :metadata="servers[index]" />
    </RadioGroup>
  </div>
</template>
