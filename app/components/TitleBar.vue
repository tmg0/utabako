<script setup lang="ts">
import { platform } from '@tauri-apps/plugin-os'

const IS_MACOS = platform() === 'macos'

const router = useRouter()
</script>

<template>
  <div data-tauri-drag-region>
    <div class="z-50 bg-white" :class="[IS_MACOS ? 'h-12' : 'h-8']">
      <div class="h-full flex items-center justify-between" :class="{ 'pl-[72px]': IS_MACOS }">
        <Button v-if="IS_MACOS" variant="ghost" size="sm" class="relative z-[101] mx-2 text-xs font-semibold" @click="router.replace({ name: 'index' })">
          UtaBako
        </Button>

        <div v-else class="flex mx-2 gap-1 items-center text-xs cursor-pointer">
          <img src="/images/utabako.png" class="size-5">

          <Button class="relative z-[101] h-6 px-2 rounded" variant="ghost" size="sm" @click="router.replace({ name: 'index' })">
            UtaBako
          </Button>
        </div>
      </div>
    </div>

    <Separator />
  </div>
</template>
