export const DEFAULT_SING_BOX_INBOUND_PORT = 5129

export const DEFAULT_OUTBOUNDS: Outbound[] = [
  {
    type: 'direct',
    tag: 'direct',
  },
]

export const DEFAULT_INBOUNDS: Inbound[] = [
  {
    type: 'mixed',
    listen: '::',
    listen_port: DEFAULT_SING_BOX_INBOUND_PORT,
    set_system_proxy: true,
  },
]

export const DEFAULT_INBOUND_TUN: Inbound = {
  auto_route: true,
  inet4_address: '172.16.0.1/30',
  inet6_address: 'fd00::1/126',
  mtu: 1492,
  sniff: true,
  sniff_override_destination: false,
  stack: 'system',
  strict_route: true,
  tag: 'tun-in',
  type: 'tun',
}

export const DEFAULT_LOG: Log = {
  disabled: true,
  level: 'info',
  timestamp: true,
}

export const DEFAULT_DNS = {}

export const DEFAULT_ROUTE: Partial<Route> = {
  rules: [
    {
      rule_set: 'geosite-cn',
      outbound: 'direct',
    },
  ],
  rule_set: [
    {
      tag: 'geosite-cn',
      type: 'remote',
      format: 'binary',
      url: 'https://raw.githubusercontent.com/SagerNet/sing-geosite/rule-set/geosite-cn.srs',
      download_detour: 'proxy',
    },
  ],
  final: 'proxy',
  auto_detect_interface: true,
}

export const DEFAULT_EXPERIMENTAL = {}
