<script setup lang="ts">
const props = defineProps<{
  open?: boolean
}>()

const emit = defineEmits(['update:open'])

const { url, isFetching, submit } = useSubscription()

const isOpen = useVModel(props, 'open', emit)

function onChangeOpen(value: boolean) {
  isOpen.value = value
}

function onSubmit() {
  submit({
    afterSubmit() {
      isOpen.value = false
    },
  })
}
</script>

<template>
  <Drawer :open="isOpen" @update:open="onChangeOpen">
    <slot />

    <DrawerContent>
      <div class="mx-auto w-full max-w-sm text-xs">
        <DrawerHeader>
          <DrawerTitle class="font-semibold text-left">
            Add Servers
          </DrawerTitle>
          <DrawerDescription class="text-xs text-left">
            Check with your proxy provider for the best way to import your servers.
          </DrawerDescription>
        </DrawerHeader>

        <div class="px-4 flex flex-col gap-2">
          <Textarea v-model="url" placeholder="Subscription URL" class="text-xs" />
          <Input placeholder="Name (Optional)" class="text-xs" />
        </div>

        <DrawerFooter>
          <Button :disabled="!url || isFetching" @click="onSubmit">
            <Spin v-if="isFetching" class="size-4" />
            Submit
          </Button>
        </DrawerFooter>
      </div>
    </DrawerContent>
  </Drawer>
</template>
