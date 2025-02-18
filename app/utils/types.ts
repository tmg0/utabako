export interface Log {
  disabled?: boolean
  level?: 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'panic'
  output?: string
  timestamp?: boolean
}

export interface VmessOutbound {
  type: 'vmess'
  tag?: string
  server: string
  server_port: number
  uuid: string
  security: string
  alter_id: number
}

export interface ShadowsocksOutbound {
  type: 'shadowsocks'
  tag?: string
  server: string
  server_port: number
  method: string
  password: string
}

export interface DirectOutbound {
  type: 'direct'
  tag?: string
  override_address?: string
  override_port?: number
}

export interface BlockOutbound {
  type: 'block'
  tag?: string
}

export interface DnsOutbound {
  type: 'dns'
  tag?: string
}

export type ProxyOutbound = VmessOutbound | ShadowsocksOutbound
export type Outbound = ProxyOutbound | DirectOutbound | BlockOutbound | DnsOutbound

export interface Inbound {
  listen?: string
  listen_port?: number
  type: 'mixed' | 'http' | 'tun'
  route_address?: string[]
  set_system_proxy?: boolean
  address?: string[]
  auto_route?: boolean
  tag?: string
  strict_route?: boolean
}

export interface RouteRule {
  protocol?: string
  inbound?: string
  outbound?: string
  rule_set?: string | string[]
  action?: string
  sniffer?: any[]
  ip_is_private?: boolean
  timeout?: string
  override_address?: string
  override_port?: number
}

export interface RouteRuleSet {
  tag: string
  type: string
  format: string
  url: string
  download_detour: string
}

export interface Route {
  rules: RouteRule[]
  rule_set: RouteRuleSet[]
  final?: string
  default_domain_resolver: string
  auto_detect_interface: boolean
}
