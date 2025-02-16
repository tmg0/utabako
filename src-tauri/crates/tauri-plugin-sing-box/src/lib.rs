use tauri::{
    plugin::{Builder, TauriPlugin},
    AppHandle, Manager, RunEvent, Runtime,
};

use tauri_plugin_shell::ShellExt;
use tokio::sync::RwLock;

mod commands;
mod error;

pub use error::{Error, Result};

pub(crate) struct SingBoxState {
    service: Option<std::process::Child>,
}

impl SingBoxState {
    pub(crate) fn new() -> Self {
        SingBoxState { service: None }
    }

    pub(crate) fn start<R: Runtime>(&mut self, app: &AppHandle<R>, config: String) -> Result<()> {
        if self.service.is_none() {
            let tauri_cmd = app.shell().sidecar("sing-box").unwrap();
            let mut std_cmd = std::process::Command::from(tauri_cmd);
            let child = std_cmd.args(["run", "-c", &config]).spawn()?;
            self.service = Some(child);
        }
        Ok(())
    }

    pub(crate) fn stop(&mut self) -> Result<()> {
        if let Some(ref mut value) = self.service {
            let _ = value.kill();
            self.service = None;
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
