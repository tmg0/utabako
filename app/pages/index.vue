<script setup lang="ts">
import ChevronRight from '~icons/heroicons/chevron-right'
import Cog6Tooth from '~icons/heroicons/cog-6-tooth'
import GlobeAsiaAustraliaSolid from '~icons/heroicons/globe-asia-australia-solid'

enum ProxyStatus {
  NOT_CONNECTED = 'Not connected',
  CONNECTING = 'Connecting...',
  CONNECTED = 'Connected',
  DISCONNECTING = 'Disconnecting...',
}

const status = ref(ProxyStatus.NOT_CONNECTED)
const isConnected = ref(false)
const service = createSingBox()

const router = useRouter()

function onChangeStatus(value: boolean) {
  isConnected.value = value
  toggleSystemProxyStatus(value)

  if (value)
    service.start()
  else
    service.stop()
}
</script>

<template>
  <div>
    <div class="h-12 -mt-12 flex items-center pl-[72px] justify-between">
      <Button variant="ghost" size="sm" class="relative z-[101] mx-2 text-xs font-semibold" @click="router.replace({ name: 'index' })">
        UtaBako
      </Button>

      <Button variant="ghost" size="icon" class="relative z-[101] w-8 h-8 p-0 mr-2" @click="router.replace({ name: 'settings' })">
        <Cog6Tooth />
      </Button>
    </div>

    <Separator />

    <div class="p-5 flex flex-col gap-6 text-xs">
      <div class="rounded-md border bg-zinc-100 py-2 pl-3 pr-2">
        <div class="flex items-center justify-between">
          <div>
            Proxy
          </div>

          <div class="flex items-center gap-2">
            <span class="text-zinc-600/50">{{ status }}</span>
            <Switch :checked="isConnected" @update:checked="onChangeStatus" />
          </div>
        </div>
      </div>

      <div>
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
                  c32s3.portablessubmarines.com
                </div>
                <div class="text-zinc-600/50 text-[0.6rem]">
                  VMess
                </div>
              </div>
            </div>

            <ChevronRight />
          </div>

          <Separator class="my-2" />

          <div class="flex justify-between pl-10 h-5 items-center">
            <div>Address</div>
            <div class="text-zinc-600/50">
              c32s3.portablessubmarines.com
            </div>
          </div>

          <Separator class="my-2" />

          <div class="flex justify-between items-center h-5 pl-10">
            <div>Status</div>

            <div class="flex items-center gap-2">
              <Button variant="outline" class="text-[0.73rem] px-2 h-5 font-normal mr-2 hover:bg-white">
                Check Status
              </Button>

              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>

              <span class="text-zinc-600/50">Online</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
