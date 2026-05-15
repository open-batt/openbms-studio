import { mockIPC } from "@tauri-apps/api/mocks";
import { MOCK_REGISTER_MAP } from "./register-map";

export function setupMocks() {
    mockIPC((cmd) => {
        if (cmd === "get_register_map") return MOCK_REGISTER_MAP;
        // Add future command mocks here
    });
}
