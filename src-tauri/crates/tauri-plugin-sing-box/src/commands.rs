use crate::{Error, SingBoxState};
use tauri::{command, image::Image, AppHandle, Manager, State, Theme};
use tokio::{runtime::Runtime, sync::RwLock};

#[command]
pub async fn start(
    app: AppHandle,
    state: State<'_, RwLock<SingBoxState>>,
    config: String,
) -> Result<(), Error> {
    let _ = state.write().await.start(&app, config);

    let window = app.get_webview_window("main").unwrap();
    let theme = window.theme()?;
    let tray = app.tray_by_id("__UTABAKO:TRAY");

    let tray_icon = match theme {
        Theme::Light => {
            Image::from_bytes(include_bytes!("../../../icons/Tray32x32LogoBlack.png")).unwrap()
        }
        Theme::Dark => {
            Image::from_bytes(include_bytes!("../../../icons/Tray32x32LogoWhite.png")).unwrap()
        }
        _ => app.default_window_icon().unwrap().clone(),
    };

    if let Some(value) = tray {
        let _ = value.set_icon(Some(tray_icon));
        let _ = value.set_icon_as_template(true);
    }

    Ok(())
}

#[command]
pub fn stop(app: AppHandle, state: State<'_, RwLock<SingBoxState>>) -> Result<(), Error> {
    let _ = exit(state);

    let window = app.get_webview_window("main").unwrap();
    let theme = window.theme()?;
    let tray = app.tray_by_id("__UTABAKO:TRAY");

    let tray_icon = match theme {
        Theme::Light => {
            Image::from_bytes(include_bytes!("../../../icons/Tray32x32LogoBlack0.png")).unwrap()
        }
        Theme::Dark => {
            Image::from_bytes(include_bytes!("../../../icons/Tray32x32LogoWhite0.png")).unwrap()
        }
        _ => app.default_window_icon().unwrap().clone(),
    };

    if let Some(value) = tray {
        let _ = value.set_icon(Some(tray_icon));
        let _ = value.set_icon_as_template(true);
    }

    Ok(())
}

pub fn exit(state: State<'_, RwLock<SingBoxState>>) -> Result<(), Error> {
    Runtime::new().unwrap().block_on(state.write()).stop()
}
