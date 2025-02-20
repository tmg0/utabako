<script setup lang="ts">
import InformationCircle from '~icons/heroicons/information-circle'

let originIndex: string

const configStore = useConfigStore()
const globalStore = useGlobalStore()
const { outbounds } = storeToRefs(configStore)
const { servers } = storeToRefs(globalStore)
const outbound = computed(() => outbounds.value?.[0])
const selected = ref<string>()
const { isLoading, restart } = useSingBox()

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

async function onSelect(value: string) {
  unwatch()
  const index = Number(value)
  const server = servers.value[index] as ProxyOutbound
  if (server)
    outbounds.value = [server]
  if (originIndex !== value)
    await restart()
  selected.value = value
}
</script>

<template>
  <Drawer>
    <DrawerTrigger as-child>
      <slot />
    </DrawerTrigger>

    <DrawerContent>
      <DrawerHeader class="pb-2">
        <DrawerTitle class="font-semibold text-left">
          Select Server
        </DrawerTitle>
        <DrawerDescription class="text-xs text-left">
          A set of checkable buttons—known as radio buttons—where no more than one of the buttons can be checked at a time.
        </DrawerDescription>
      </DrawerHeader>

      <div class="px-4 pb-4 pt-2 text-xs max-h-72 overflow-y-auto">
        <RadioGroup :model-value="selected" :disabled="isLoading" @update:model-value="onSelect">
          <div v-for="(item, index) in hosts" :key="index" class="flex items-center space-x-2 gap-2 rounded-md border p-4 bg-zinc-50">
            <RadioGroupItem :value="String(index)" />

            <Label class="flex-1 space-y-1">
              <p class="text-xs font-semibold leading-none truncate">
                {{ item }}
              </p>
              <p class="text-[0.6rem] text-muted-foreground capitalize">
                {{ servers[index]?.type ?? 'Unknown' }}
              </p>
            </Label>

            <InformationCircle class="size-4 cursor-pointer text-muted-foreground" />
          </div>
        </RadioGroup>
      </div>
    </DrawerContent>
  </Drawer>
</template>
