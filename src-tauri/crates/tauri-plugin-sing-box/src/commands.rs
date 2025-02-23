use crate::{Error, SingBoxState};
use tauri::{command,  AppHandle, Manager, State};
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
    state.write().await.start(&app, config)
}

#[command]
pub fn stop(state: State<'_, RwLock<SingBoxState>>) -> Result<(), Error> {
    Runtime::new().unwrap().block_on(state.write()).stop()
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

pub fn executable_resource<R: tauri::Runtime>(
    app: &AppHandle<R>,
    program: &str,
) -> Result<String, Error> {
    let resource_dir = app.path().resource_dir()?;

    #[cfg(target_os = "macos")]
    let suffix = "";

    #[cfg(target_os = "windows")]
    let suffix = ".exe";

    Ok(
        dunce::canonicalize(resource_dir.join(format!("{}{}", program, suffix)))?
            .to_string_lossy()
            .into_owned(),
    )
}
