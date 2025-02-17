<script setup lang="ts">
import InformationCircle from '~icons/heroicons/information-circle'

defineProps<{
  label?: string
  value: number
  metadata?: Outbound
}>()
</script>

<template>
  <div class="flex items-center space-x-2 gap-2 rounded-md border p-4 bg-zinc-100">
    <RadioGroupItem :value="String(value)" />

    <Label class="flex-1 space-y-1">
      <p class="text-xs font-semibold leading-none truncate">
        {{ label }}
      </p>
      <p class="text-[0.6rem] text-muted-foreground capitalize">
        {{ metadata?.type ?? 'Unknown' }}
      </p>
    </Label>

    <InformationCircle class="size-4 cursor-pointer text-muted-foreground" />
  </div>
</template>
