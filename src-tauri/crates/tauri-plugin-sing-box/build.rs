const COMMANDS: &[&str] = &["start", "stop", "elevate_privileges"];

fn main() {
    tauri_plugin::Builder::new(COMMANDS)
        .android_path("android")
        .ios_path("ios")
        .build();
}
