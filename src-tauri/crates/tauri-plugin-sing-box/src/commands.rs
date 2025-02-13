use crate::{Error, SingBoxState};
use tauri::{command, AppHandle, State};
use tokio::sync::RwLock;

#[command]
pub async fn start(
    app: AppHandle,
    state: State<'_, RwLock<SingBoxState>>,
    config: String,
) -> Result<(), Error> {
    state.write().await.start(app, config)
}

#[command]
pub async fn stop(state: State<'_, RwLock<SingBoxState>>) -> Result<(), Error> {
    state.write().await.stop()
}
