export function defineSingBoxOutbound(outbound: Outbound): Outbound {
  return {
    tag: 'proxy',
    ...outbound,
  }
}
