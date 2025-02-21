use tauri::{
    plugin::{Builder, TauriPlugin},
    AppHandle, Manager, RunEvent, Runtime,
};

use std::process::{Child, Command};
use tokio::sync::RwLock;
use tauri_plugin_shell::ShellExt;
use rustem_proxy::SystemProxy;

#[cfg(target_os = "macos")]
use nix::sys::signal::{kill, Signal};

#[cfg(target_os = "macos")]
use nix::unistd::Pid;

mod commands;
mod error;

pub use error::{Error, Result};

pub(crate) struct SingBoxState {
    process: Option<Child>,
}

impl SingBoxState {
    pub(crate) fn new() -> Self {
        SingBoxState { process: None }
    }

    pub(crate) fn start<R: Runtime>(&mut self, app: &AppHandle<R>, config: String) -> Result<()> {
        if self.process.is_none() {
            #[cfg(target_os = "macos")]
            {
                let resource_dir = app.path().resource_dir()?;
                let sing_box = resource_dir.join("sing-box").to_string_lossy().into_owned();
                let mut std_cmd = Command::new("osascript");
                let e = format!("do shell script \"{} run -c {}\" with administrator privileges", sing_box, config.replace(" ", "\\ "));
                println!("{}", e);
                let mut osascript = std_cmd.arg("-e").arg(e).spawn()?;
                osascript.wait()?;
            }

            let tauri_cmd = app.shell().sidecar("sing-box").unwrap();
            let mut std_cmd = Command::from(tauri_cmd);
            let child = std_cmd.args(["run", "-c", &config]).spawn()?;
            self.process = Some(child);
        }
        Ok(())
    }

    pub(crate) fn stop(&mut self) -> Result<()> {
        if let Some(ref mut value) = self.process {
            #[cfg(target_os = "macos")]
            let pid = value.id();

            #[cfg(target_os = "macos")]
            kill(Pid::from_raw(pid as i32), Signal::SIGINT).unwrap();

            #[cfg(target_os = "windows")]
            let _ = value.kill();

            SystemProxy::unset();

            self.process = None;
        }
        Ok(())
    }
}

/// Initializes the plugin.
pub fn init() -> TauriPlugin<tauri::Wry> {
    Builder::new("sing-box")
        .invoke_handler(tauri::generate_handler![commands::start, commands::stop,])
        .setup(|app, _| {
            app.manage(RwLock::new(SingBoxState::new()));
            Ok(())
        })
        .on_event(|app, event| match event {
            RunEvent::Exit => {
                let state = app.state::<RwLock<SingBoxState>>();
                let _ = commands::exit(state);
            }
            _ => {}
        })
        .build()
}
