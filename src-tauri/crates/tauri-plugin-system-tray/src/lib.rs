use tauri::{
    menu::{Menu, MenuItem},
    plugin::{Builder, TauriPlugin},
    tray::TrayIconBuilder,
    Manager, RunEvent, Runtime,
};

mod error;

pub use error::{Error, Result};

/// Initializes the plugin.
pub fn init<R: Runtime>() -> TauriPlugin<R> {
    Builder::new("system-tray")
        .invoke_handler(tauri::generate_handler![])
        .setup(|app, _| {
            let show_i = MenuItem::with_id(app, "show", "Show", true, None::<&str>)?;
            let quit_i = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;
            let menu = Menu::with_items(app, &[&show_i, &quit_i])?;

            let _ = TrayIconBuilder::new()
                .icon(app.default_window_icon().unwrap().clone())
                .menu(&menu)
                .on_menu_event(move |app, event| match event.id.as_ref() {
                    "show" => {
                        let window = app.get_webview_window("main").unwrap();
                        if !window.is_visible().unwrap() {
                            window.show().unwrap();
                            window.set_focus().unwrap();
                        }
                    }
                    "quit" => {
                        app.exit(0);
                    }
                    _ => {}
                })
                .build(app)?;

            Ok(())
        })
        .on_event(|app, event| match event {
            tauri::RunEvent::WindowEvent {
                label,
                event: window_event,
                ..
            } => match window_event {
                tauri::WindowEvent::CloseRequested { api, .. } => {
                    let window = app.get_webview_window(label.as_str()).unwrap();
                    window.hide().unwrap();
                    api.prevent_close();
                }
                _ => {}
            },
            RunEvent::ExitRequested { api, code, .. } => {
                if code.is_none() {
                    api.prevent_exit();
                }
            }
            _ => {}
        })
        .build()
}
