<script setup lang="ts">
const router = useRouter()
</script>

<template>
  <div>
    <div data-tauri-drag-region class="z-50 h-12 bg-white">
      <div class="h-full flex items-center pl-[72px] justify-between">
        <Button variant="ghost" size="sm" class="relative z-[101] mx-2 text-xs font-semibold" @click="router.replace({ name: 'index' })">
          UtaBako
        </Button>
      </div>
    </div>

    <Separator />
  </div>
</template>
