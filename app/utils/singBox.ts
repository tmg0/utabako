export function defineSingBoxOutbound<T = Outbound>(outbound: Outbound): T {
  return {
    tag: 'proxy',
    ...outbound,
  } as T
}
