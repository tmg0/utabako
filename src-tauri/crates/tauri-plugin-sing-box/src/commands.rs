use crate::{Error, SingBoxState};
use rustem_proxy::{Protocol, SystemProxy};
use tauri::{command, AppHandle, State};
use tokio::sync::RwLock;

#[command]
pub async fn start(
    app: AppHandle,
    state: State<'_, RwLock<SingBoxState>>,
    config: String,
) -> Result<(), Error> {
    SystemProxy::set(SystemProxy {
        is_enabled: true,
        host: "127.0.0.1".to_string(),
        port: 5129,
        bypass: "*.local,169.254/16,10.4.38.222,10.255.*,124.220.*".to_string(),
        protocol: Protocol::SOCKS,
    });

    state.write().await.start(app, config)
}

#[command]
pub async fn stop(state: State<'_, RwLock<SingBoxState>>) -> Result<(), Error> {
    SystemProxy::set(SystemProxy {
        is_enabled: false,
        host: "127.0.0.1".to_string(),
        port: 5129,
        bypass: "".to_string(),
        protocol: Protocol::SOCKS,
    });

    state.write().await.stop()
}
