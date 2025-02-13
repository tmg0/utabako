use crate::{Error, SingBoxState};
use rustem_proxy::{Protocol, SystemProxy};
use tauri::{command, AppHandle, State};
use tokio::sync::RwLock;

#[cfg(target_os = "windows")]
static DEFAULT_BYPASS: &str = "localhost;127.*;192.168.*;<local>";
#[cfg(target_os = "linux")]
static DEFAULT_BYPASS: &str = "localhost,127.0.0.1,::1";
#[cfg(target_os = "macos")]
static DEFAULT_BYPASS: &str = "127.0.0.1,localhost,<local>";

static DEFAULT_HOST: &str = "127.0.0.1";

fn toggle_system_proxy(is_enabled: bool, protocol: String) {
    let bypass = if is_enabled { DEFAULT_BYPASS } else { "" };

    let protocol = match  protocol.as_str() {
        "http" => Protocol::HTTP,
        "https" => Protocol::HTTPS,
        "socks" => Protocol::SOCKS,
        _ => Protocol::ALL,
    };

    SystemProxy::set(SystemProxy {
        is_enabled: is_enabled,
        host:DEFAULT_HOST.to_string(),
        port: 5129,
        bypass: bypass.to_string(),
        protocol: protocol,
    });
}

#[command]
pub async fn start(
    app: AppHandle,
    state: State<'_, RwLock<SingBoxState>>,
    config: String,
    protocol: String
) -> Result<(), Error> {
    toggle_system_proxy(true, protocol);
    state.write().await.start(app, config)
}

#[command]
pub async fn stop(state: State<'_, RwLock<SingBoxState>>, protocol: String) -> Result<(), Error> {
    toggle_system_proxy(false, protocol);
    state.write().await.stop()
}
