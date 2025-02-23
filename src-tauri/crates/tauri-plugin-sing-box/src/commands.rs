use crate::{Error, SingBoxState};
use tauri::{command, image::Image, AppHandle, Manager, State, Theme};
use tokio::{runtime::Runtime, sync::RwLock};

#[cfg(target_os = "windows")]
use dunce;

#[cfg(target_os = "windows")]
use winreg::{enums, RegKey};

#[command]
pub async fn start(
    app: AppHandle,
    state: State<'_, RwLock<SingBoxState>>,
    config: String,
) -> Result<(), Error> {
    let result = state.write().await.start(&app, config);
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

    result
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

#[command]
pub async fn elevate_privileges(app: AppHandle) -> Result<(), Error> {
    #[cfg(target_os = "windows")]
    {
        let utabako = executable_resource(&app, "app")?;
        let current_user = RegKey::predef(enums::HKEY_CURRENT_USER);
        let sub_key = "Software\\Microsoft\\Windows NT\\CurrentVersion\\AppCompatFlags\\Layers";
        let key = current_user.open_subkey_with_flags(sub_key, enums::KEY_SET_VALUE)?;
        key.set_value(&utabako, &"RunAsAdmin")?;
    }

    #[cfg(target_os = "macos")]
    {
        let resource_dir = app.path().resource_dir()?;
        let sing_box = resource_dir.join("sing-box").to_string_lossy().into_owned();
        let mut std_cmd = Command::new("osascript");
        let e = format!(
            "do shell script \"{} run -c {}\" with administrator privileges",
            sing_box,
            config.replace(" ", "\\ ")
        );
        println!("{}", e);
        let mut osascript = std_cmd.arg("-e").arg(e).spawn()?;
        osascript.wait()?;
    }

    Ok(())
}

pub fn executable_resource<R: tauri::Runtime>(app: &AppHandle<R>, program: &str) -> Result<String, Error> {
    let resource_dir = app.path().resource_dir()?;

    #[cfg(target_os = "macos")]
    let suffix = "";

    #[cfg(target_os = "windows")]
    let suffix = ".exe";

    Ok(dunce::canonicalize(resource_dir.join(format!("{}{}", program, suffix)))?
        .to_string_lossy()
        .into_owned())
}

pub fn exit(state: State<'_, RwLock<SingBoxState>>) -> Result<(), Error> {
    Runtime::new().unwrap().block_on(state.write()).stop()
}
