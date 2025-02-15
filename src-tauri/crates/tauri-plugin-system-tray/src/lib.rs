use tauri::{
    menu::{Menu, MenuItem},
    plugin::{Builder, TauriPlugin},
    tray::TrayIconBuilder,
    RunEvent, Runtime,
};

mod error;

pub use error::{Error, Result};

/// Initializes the plugin.
pub fn init<R: Runtime>() -> TauriPlugin<R> {
    Builder::new("system-tray")
        .invoke_handler(tauri::generate_handler![])
        .setup(|app, _| {
            let quit_i = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;
            let menu = Menu::with_items(app, &[&quit_i])?;

            let _ = TrayIconBuilder::new()
                .icon(app.default_window_icon().unwrap().clone())
                .menu(&menu)
                .on_menu_event(|app, event| match event.id.as_ref() {
                    "quit" => {
                      app.exit(0);
                    }
                    _ => {}
                })
                .build(app)?;

            Ok(())
        })
        .on_event(|_, event| match event {
            RunEvent::ExitRequested { api, code, .. } => {
              if code.is_none() {
                api.prevent_exit();
              }
            }
            _ => {}
        })
        .build()
}
