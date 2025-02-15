<script setup lang="ts">
const { servers } = useServers()
const router = useRouter()
const store = useConfigStore()
const { outbounds } = storeToRefs(store)
const outbound = computed(() => outbounds.value?.[0])
const selected = ref<string>()

onMounted(async () => {
  await sleep(50)
  selected.value = host(outbound.value)
})

function host(value?: Outbound) {
  const a = [
    value?.server,
    value?.server_port,
  ].filter(Boolean)

  if (a.length) {
    return a.join(':')
  }
}

function onSave() {
  const server = servers.value.find(v => host(v) === selected.value)
  if (server)
    outbounds.value = [server]
  router.replace({ name: 'index' })
}
</script>

<template>
  <div class="p-5">
    <RadioGroup v-model="selected">
      <ServerRadioGroup v-for="(server, index) in servers" :key="index" :value="host(server)" />
    </RadioGroup>

    <div class="flex justify-end gap-2 mt-5">
      <Button size="sm" variant="ghost" @click="router.replace({ name: 'index' })">
        Cancel
      </Button>

      <Button size="sm" :disabled="host(outbound) === selected" @click="onSave">
        Save Changes
      </Button>
    </div>
  </div>
</template>
