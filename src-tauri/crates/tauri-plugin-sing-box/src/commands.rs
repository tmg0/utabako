use crate::{Error, SingBoxState};
use tauri::{command, image::Image, AppHandle, State};
use tokio::{runtime::Runtime, sync::RwLock};

#[command]
pub async fn start(
    app: AppHandle,
    state: State<'_, RwLock<SingBoxState>>,
    config: String,
) -> Result<(), Error> {
    let _ = state.write().await.start(&app, config);

    let tray = app.tray_by_id("__UTABAKO:TRAY");
    let tray_icon = Image::from_bytes(include_bytes!("../../../icons/Tray32x32Logo.png")).unwrap();

    if let Some(value) = tray {
        let _ = value.set_icon(Some(tray_icon));
    }

    Ok(())
}

#[command]
pub fn stop(app: AppHandle, state: State<'_, RwLock<SingBoxState>>) -> Result<(), Error> {
    let _ = exit(state);

    let tray = app.tray_by_id("__UTABAKO:TRAY");
    let tray_icon =
        Image::from_bytes(include_bytes!("../../../icons/Tray32x32LogoInactive.png")).unwrap();

    if let Some(value) = tray {
        let _ = value.set_icon(Some(tray_icon));
    }

    Ok(())
}

pub fn exit(state: State<'_, RwLock<SingBoxState>>) -> Result<(), Error> {
    Runtime::new().unwrap().block_on(state.write()).stop()
}
