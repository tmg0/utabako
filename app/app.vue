<script setup lang="ts">
const store = useConfigStore()
const { inbounds, outbounds } = storeToRefs(store)
const { url } = useSubscription()

const disabled = computed(() => !inbounds.value.length || !outbounds.value.length)
const isOpen = ref(false)

onMounted(() => {
  isOpen.value = disabled.value
})
</script>

<template>
  <div class="w-screen h-screen flex flex-col overflow-hidden bg-zinc-50">
    <TitleBar />

    <main vaul-drawer-wrapper>
      <Drawer v-model:open="isOpen">
        <NuxtPage />

        <DrawerContent>
          <div class="mx-auto w-full max-w-sm text-xs">
            <DrawerHeader class="mt-2">
              <DrawerTitle class="font-semibold text-left">
                Add Servers
              </DrawerTitle>
              <DrawerDescription class="text-xs text-left">
                Check with your proxy provider for the best way to import your servers.
              </DrawerDescription>
            </DrawerHeader>

            <div class="py-2 px-4 flex flex-col gap-2">
              <Textarea v-model="url" placeholder="Subscription URL" class="text-xs" />
              <Input placeholder="Name (Optional)" class="text-xs" />
            </div>

            <DrawerFooter>
              <Button :disabled="!url">
                Submit
              </Button>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </main>
  </div>
</template>

<style>
:root {
  user-select: none;
  background-color: #fafafa;
  overscroll-behavior: none;
}
</style>
