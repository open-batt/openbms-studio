import { mockIPC } from "@tauri-apps/api/mocks";
import { MOCK_REGISTER_MAP } from "./register-map";

export function setupMocks() {
    mockIPC((cmd) => {
        if (cmd === "get_register_map") return MOCK_REGISTER_MAP;
        if (cmd === "set_polling_interval") return; // no-op in dev
        if (cmd === "read_register") return { Word: 0 }; // static registers show 0 in dev mode
    });
}
