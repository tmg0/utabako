<script setup lang="ts">
import ChevronRight from '~icons/heroicons/chevron-right'
import GlobeAsiaAustraliaSolid from '~icons/heroicons/globe-asia-australia-solid'

enum ProxyStatus {
  NOT_CONNECTED = 'Not connected',
  CONNECTING = 'Connecting...',
  CONNECTED = 'Connected',
  DISCONNECTING = 'Disconnecting...',
}

const globalStore = useGlobalStore()
const configStore = useConfigStore()
const { isConnected } = storeToRefs(globalStore)
const { inbounds, outbounds } = storeToRefs(configStore)
const { isLoading, enable, disable } = useSingBox()

const outbound = computed(() => outbounds.value?.[0])
const inbound = computed(() => inbounds.value?.[0])
const disabled = computed(() => !inbound.value || !outbound.value)

async function onChangeStatus(value: boolean) {
  if (disabled.value)
    return

  if (value)
    await enable()
  else
    await disable()

  isConnected.value = value
}
</script>

<template>
  <div>
    <div class="p-5 flex flex-col gap-6 text-xs">
      <div class="rounded-md border bg-zinc-100 py-2 pl-3 pr-2">
        <div class="flex items-center justify-between">
          <div>
            Proxy
          </div>

          <div class="flex items-center gap-2">
            <span class="text-zinc-600/50">{{ isConnected ? (isLoading ? ProxyStatus.DISCONNECTING : ProxyStatus.CONNECTED) : (isLoading ? ProxyStatus.CONNECTING : ProxyStatus.NOT_CONNECTED) }}</span>
            <Switch :disabled="disabled" :checked="isConnected" @update:checked="onChangeStatus" />
          </div>
        </div>
      </div>

      <div v-if="outbound">
        <div class="ml-2 mb-2 font-semibold">
          Selected Server
        </div>

        <div class="rounded-md border bg-zinc-100 py-2 px-3">
          <div class="flex items-center justify-between cursor-pointer">
            <div class="flex items-center gap-2">
              <div class=" bg-primary size-8 rounded-lg flex items-center justify-center">
                <GlobeAsiaAustraliaSolid class="size-6 text-white" />
              </div>

              <div>
                <div class="font-semibold">
                  {{ outbound.server }}
                </div>
                <div class="text-zinc-600/50 text-[0.55rem] uppercase">
                  {{ outbound.type }}
                </div>
              </div>
            </div>

            <ChevronRight />
          </div>

          <Separator class="my-2" />

          <div class="flex justify-between pl-10 h-5 items-center">
            <div>Address</div>
            <div class="text-zinc-600/50">
              {{ outbound.server }}
            </div>
          </div>

          <Separator class="my-2" />

          <div class="flex justify-between items-center h-5 pl-10">
            <div>Status</div>
            <ServiceStatus :value="[outbound.server, outbound.server_port ?? 80].join(':')" show-check-btn />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
