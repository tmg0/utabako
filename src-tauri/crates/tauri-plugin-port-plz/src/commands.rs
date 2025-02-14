use std::net::TcpListener;
use tauri::command;
use crate::Error;

#[command]
pub(crate) async fn check(port: u16) -> Result<bool, Error> {
    match TcpListener::bind(("127.0.0.1", port)) {
        Ok(_) => Ok(true),
        Err(_) => Ok(false),
    }
}
