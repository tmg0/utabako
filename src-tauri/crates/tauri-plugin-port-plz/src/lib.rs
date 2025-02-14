use tauri::{
    plugin::{Builder, TauriPlugin},
    Runtime,
};

mod commands;
mod error;

pub use error::{Error, Result};

/// Initializes the plugin.
pub fn init<R: Runtime>() -> TauriPlugin<R> {
    Builder::new("port-plz")
        .invoke_handler(tauri::generate_handler![commands::check])
        .build()
}
