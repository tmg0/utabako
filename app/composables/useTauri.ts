export function useTauriStorage<T = unknown>(key: string, initialValue: MaybeRefOrGetter<T>, file: string) {
  return useStorageAsync<T>(
    key,
    initialValue,
    createTrauriStorage(file),
    {
      serializer: {
        read: (v: any) => v ?? undefined,
        write: (v: any) => v,
      },
    },
  )
}
