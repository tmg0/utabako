use tauri::{
    plugin::{Builder, TauriPlugin},
    AppHandle, Manager, RunEvent, Runtime,
};

use std::process::{Child, Command};
use tauri_plugin_shell::ShellExt;
use tokio::sync::RwLock;

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
            let tauri_cmd = app.shell().sidecar("sing-box").unwrap();
            let mut std_cmd = Command::from(tauri_cmd);
            let child = std_cmd.args(["run", "-c", &config]).spawn()?;
            self.process = Some(child);
        }
        Ok(())
    }

    pub(crate) fn stop(&mut self) -> Result<()> {
        if let Some(ref mut value) = self.process {
            let pid = value.id();

            #[cfg(target_os = "macos")]
            kill(Pid::from_raw(pid as i32), Signal::SIGINT).unwrap();

            #[cfg(target_os = "windows")]
            unsafe {
                let _ = GenerateConsoleCtrlEvent(CTRL_BREAK_EVENT, pid);
            }

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
