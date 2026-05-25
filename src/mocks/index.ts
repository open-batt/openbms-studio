import { mockIPC } from "@tauri-apps/api/mocks";
import type { BmsConfig } from "@/bindings/BmsConfig";
import { MOCK_REGISTER_MAP } from "./register-map";

const MOCK_CONFIG: BmsConfig = {
    version: 1,
    battery_mode: 0x6001,
    at_rate: 0,
    charging_current_ma: 2000,
    charging_voltage_mv: 25200,
    configuration: 0x0007,
    main_control: 0x0007,
    fet_state: 0x0003,
    balancing_control: 0x007f,
    protection_voltage: Array(16).fill(0),
    protection_current: Array(12).fill(0),
    protection_temperature: Array(4).fill(0),
    calibration_current: Array(4).fill(0),
    calibration_voltage: Array(28).fill(0),
    calibration_temperature: Array(1).fill(0),
};

export function setupMocks() {
    mockIPC((cmd) => {
        if (cmd === "get_register_map") return MOCK_REGISTER_MAP;
        if (cmd === "set_polling_interval") return;
        if (cmd === "read_register") return { Word: 0 };
        if (cmd === "read_config") return MOCK_CONFIG;
        if (cmd === "write_config") return null;
    });
}
