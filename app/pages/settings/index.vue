<script setup lang="ts">
const router = useRouter()
</script>

<template>
  <div>
    <div class="h-12 -mt-12 flex items-center pl-[72px]">
      <Button variant="ghost" size="sm" class="relative z-[101] mx-2 text-xs font-semibold" @click="router.replace({ name: 'index' })">
        UtaBako
      </Button>
    </div>

    <Separator />
  </div>
</template>
