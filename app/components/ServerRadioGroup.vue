<script setup lang="ts">
defineProps<{
  value?: string
}>()
</script>

<template>
  <div class="flex items-center space-x-2 rounded-md border p-4 bg-zinc-100">
    <Label :for="value" class="flex-1 space-y-1">
      <p class="text-xs font-semibold leading-none">
        {{ value }}
      </p>
      <p class="text-[0.6rem] text-muted-foreground capitalize">
        Send notifications to device.
      </p>
    </Label>
    <RadioGroupItem :id="value" :value="value" />
  </div>
</template>
