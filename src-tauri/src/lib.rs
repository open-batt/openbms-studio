// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

pub mod error;
pub mod types;
pub mod bms_data;
pub mod transport;
pub mod register_map;
pub mod polling;
pub mod commands;
pub mod config;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    use std::sync::Arc;
    use crate::polling::BmsState;

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(Arc::new(BmsState::new()))
        .invoke_handler(tauri::generate_handler![
            commands::list_ports,
            commands::connect,
            commands::disconnect,
            commands::start_polling,
            commands::stop_polling,
            commands::get_register_map,
            commands::read_register,
            commands::write_register,
            commands::write_field,
            commands::set_polling_interval,
        ])
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
