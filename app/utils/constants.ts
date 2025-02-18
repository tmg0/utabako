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
  },
]

export const DEFAULT_LOG: Log = {
  disabled: true,
  level: 'info',
  timestamp: true,
}

export const DEFAULT_DNS = {
  servers: [
    {
      tag: 'google',
      address: 'tls://dns.google',
      address_resolver: 'ali',
      address_strategy: 'ipv4_only',
      detour: 'proxy',
    },
    {
      tag: 'ali',
      address: '223.5.5.5',
      detour: 'direct',
    },
  ],

  rules: [
    {
      rule_set: ['geosite-cn'],
      action: 'route',
      server: 'google',
    },
  ],

  final: 'ali',
  disable_cache: true,
  strategy: 'ipv4_only',
}

export const DEFAULT_ROUTE: Partial<Route> = {
  rules: [
    {
      action: 'sniff',
    },
    {
      protocol: 'dns',
      action: 'hijack-dns',
    },
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
