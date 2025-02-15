<script setup lang="ts">
const props = defineProps<{
  value: string
  showCheckBtn?: boolean
}>()

const server = toRef(props.value)
const { status, execute } = useServerStatus(server)

const color = computed(() => {
  const colors = {
    [ServerStatus.UNKNOWN]: ['bg-zinc-400', 'bg-zinc-500'],
    [ServerStatus.ONLINE]: ['bg-green-400', 'bg-green-500'],
    [ServerStatus.OFFLINE]: ['bg-red-400', 'bg-red-500'],
  }

  return colors[status.value]
})
</script>

<template>
  <div class="flex gap-2 items-center">
    <Button v-if="showCheckBtn" variant="outline" class="text-[0.73rem] px-2 h-5 font-normal mr-2 hover:bg-white" @click="execute">
      Check Status
    </Button>

    <span class="relative flex h-2 w-2">
      <span class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" :class="color[0]" />
      <span class="relative inline-flex rounded-full h-2 w-2" :class="color[1]" />
    </span>

    <span class="text-muted-foreground">{{ status }}</span>
  </div>
</template>
