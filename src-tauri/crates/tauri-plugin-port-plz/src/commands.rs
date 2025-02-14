use crate::Error;
use std::time::Duration;
use tauri::command;

#[command]
pub(crate) async fn check(port: u16) -> Result<bool, Error> {
    let address = format!("{}{}", "127.0.0.1:", port);
    let is_reachable =
        port_check::is_port_reachable_with_timeout(&address, Duration::from_millis(10_000));
    Ok(is_reachable)
}
