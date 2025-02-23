use tauri::{
    plugin::{Builder, TauriPlugin},
    AppHandle, Manager, RunEvent, Runtime,
};

use rustem_proxy::SystemProxy;
use std::process::{Child, Command};
use tokio::sync::RwLock;

#[cfg(target_os = "macos")]
use nix::sys::signal::{kill, Signal};

#[cfg(target_os = "macos")]
use nix::unistd::Pid;

#[cfg(target_os = "windows")]
use std::os::windows::process::CommandExt;

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
            let singbox = commands::executable_resource(app, "sing-box")?;
            let mut cmd = Command::new(singbox);

            #[cfg(target_os = "windows")]
            cmd.creation_flags(0x08000000);

            let child = cmd.args(["run", "-c", &config]).spawn()?;
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
        .invoke_handler(tauri::generate_handler![
            commands::start,
            commands::stop,
            commands::elevate_privileges
        ])
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
