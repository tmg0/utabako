use crate::{Error, SingBoxState};
use tauri::{command, AppHandle, State};
use tokio::{runtime::Runtime, sync::RwLock};

#[command]
pub async fn start(
    app: AppHandle,
    state: State<'_, RwLock<SingBoxState>>,
    config: String,
) -> Result<(), Error> {
    state.write().await.start(app, config)
}

#[command]
pub fn stop(state: State<'_, RwLock<SingBoxState>>) -> Result<(), Error> {
    Runtime::new().unwrap().block_on(state.write()).stop()
}
