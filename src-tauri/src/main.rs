// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

// use tauri::command;
// use std::process::Command;

// #[command]
// fn run_executable(path: &str, args: Vec<String>) -> Result<String, String> {
//     let output = Command::new(path) // Path to executable
//         .args(args) // args for exe
//         .output()
//         .map_err(|e| e.to_string())?;

//     let output_str = String::from_utf8_lossy(&output.stdout).to_string();
//     Ok(output_str)
// }