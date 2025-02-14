use tauri::{
    plugin::{Builder, TauriPlugin},
    RunEvent, Runtime,
};

mod commands;
mod error;

pub use error::{Error, Result};

/// Initializes the plugin.
pub fn init<R: Runtime>() -> TauriPlugin<R> {
    Builder::new("system-proxy")
        .invoke_handler(tauri::generate_handler![
            commands::set,
            commands::get,
            commands::unset
        ])
        .on_event(|_, event| match event {
            RunEvent::Exit => {
                commands::unset();
            }
            _ => {}
        })
        .build()
}
