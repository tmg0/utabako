<template>
  <div class="w-screen h-screen flex flex-col overflow-hidden bg-zinc-50">
    <TitleBar class="flex-shrink-0" />

    <main vaul-drawer-wrapper class="flex-1 overflow-y-auto">
      <NuxtPage />
    </main>

    <Toaster />
  </div>
</template>

<style>
:root {
  user-select: none;
  background-color: #fafafa;
  overscroll-behavior: none;
}
</style>
