use rustem_proxy::{Protocol, SystemProxy};
use serde::Serialize;
use tauri::command;

#[derive(Serialize)]
pub struct SystemProxyReturn {
    is_enabled: bool,
    host: String,
    port: u16,
    bypass: String,
    protocol: String,
}

#[cfg(target_os = "windows")]
static DEFAULT_BYPASS: &str = "localhost;127.*;192.168.*;<local>";
#[cfg(target_os = "linux")]
static DEFAULT_BYPASS: &str = "localhost,127.0.0.1,::1";
#[cfg(target_os = "macos")]
static DEFAULT_BYPASS: &str = "127.0.0.1,localhost,<local>";

static DEFAULT_HOST: &str = "127.0.0.1";

#[command]
pub(crate) async fn set(is_enabled: bool, port: u16, protocol: String) {
    let bypass = if is_enabled { DEFAULT_BYPASS } else { "" };

    let protocol = match protocol.as_str() {
        "http" => Protocol::HTTP,
        "https" => Protocol::HTTPS,
        "socks" => Protocol::SOCKS,
        _ => Protocol::ALL,
    };

    SystemProxy::set(SystemProxy {
        is_enabled: is_enabled,
        host: DEFAULT_HOST.to_string(),
        port,
        bypass: bypass.to_string(),
        protocol: protocol,
    });
}

#[command]
pub(crate) async fn get() -> Result<SystemProxyReturn, ()> {
    let proxy = SystemProxy::get();

    let results = SystemProxyReturn {
        is_enabled: proxy.is_enabled,
        host: proxy.host,
        port: proxy.port,
        bypass: proxy.bypass,
        protocol: match proxy.protocol {
            Protocol::HTTP => "http",
            Protocol::HTTPS => "https",
            Protocol::SOCKS => "socks",
            Protocol::ALL => "all",
        }
        .to_string(),
    };

    Ok(results)
}

#[command]
pub fn unset() {
    SystemProxy::unset();
}
