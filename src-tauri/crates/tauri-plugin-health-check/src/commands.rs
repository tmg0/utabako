use crate::Error;
use std::time::Duration;
use tauri::command;

#[command]
pub(crate) async fn ping(service: String) -> Result<bool, Error> {
    let is_reachable =
        port_check::is_port_reachable_with_timeout(&service, Duration::from_millis(10_000));
    Ok(is_reachable)
}
