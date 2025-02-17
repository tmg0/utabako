use tauri::{
    image::Image,
    menu::{Menu, MenuItem},
    plugin::{Builder, TauriPlugin},
    tray::TrayIconBuilder,
    Manager, RunEvent, Runtime, Theme,
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

            let default_tray_icon = Image::from_bytes(include_bytes!(
                "../../../icons/Tray32x32LogoBlack0.png"
            ))
            .unwrap();

            let _ = TrayIconBuilder::with_id("__UTABAKO:TRAY")
                .icon(default_tray_icon)
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

            RunEvent::Ready => {
                let window = app.get_webview_window("main").unwrap();
                let theme = window.theme();

                if let Ok(theme) = theme {
                    let tray = app.tray_by_id("__UTABAKO:TRAY");

                    let tray_icon = match theme {
                        Theme::Light => Image::from_bytes(include_bytes!(
                            "../../../icons/Tray32x32LogoBlack0.png"
                        ))
                        .unwrap(),
                        Theme::Dark => Image::from_bytes(include_bytes!(
                            "../../../icons/Tray32x32LogoWhite0.png"
                        ))
                        .unwrap(),
                        _ => app.default_window_icon().unwrap().clone(),
                    };

                    if let Some(value) = tray {
                        let _ = value.set_icon(Some(tray_icon));
                    }
                }
            }

            RunEvent::ExitRequested { api, code, .. } => {
                if code.is_none() {
                    api.prevent_exit();
                }
            }
            _ => {}
        })
        .build()
}
