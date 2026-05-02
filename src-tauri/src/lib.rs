// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

pub mod error;
pub mod types;
pub mod bms_data;
pub mod transport;
pub mod register_map;
pub mod polling;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[cfg(test)]
mod ts_export {
    use crate::{bms_data::BmsData, error::CommsError, types::*};
    use ts_rs::TS;

    #[test]
    fn export_bindings() {
        RegisterDef::export_all().unwrap();
        RegisterValue::export_all().unwrap();
        Access::export_all().unwrap();
        ValueType::export_all().unwrap();
        FieldDef::export_all().unwrap();
        FieldType::export_all().unwrap();
        PrimitiveType::export_all().unwrap();
        BmsData::export_all().unwrap();
        CommsError::export_all().unwrap();
    }
}
