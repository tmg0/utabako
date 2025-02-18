export const DEFAULT_SING_BOX_INBOUND_PORT = 5129

export const DEFAULT_OUTBOUNDS: Outbound[] = []

export const DEFAULT_INBOUNDS: Inbound[] = [
  {
    listen: '::',
    listen_port: DEFAULT_SING_BOX_INBOUND_PORT,
    type: 'http',
  },
]

export const DEFAULT_LOG: Log = {
  disabled: true,
  level: 'info',
  timestamp: true,
}

export const DEFAULT_DNS = {}

export const DEFAULT_ROUTE: Partial<Route> = {}

export const DEFAULT_EXPERIMENTAL = {}
