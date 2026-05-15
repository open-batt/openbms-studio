import { useCallback, useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import type { RegisterDef, RegisterValue } from "../bindings";

export function useRegisters() {
    const [registerMap, setRegisterMap] = useState<RegisterDef[]>([]);

    useEffect(() => {
        invoke<RegisterDef[]>("get_register_map").then(setRegisterMap);
    }, []);

    const readRegister = useCallback((name: string): Promise<RegisterValue> => {
        return invoke<RegisterValue>("read_register", { name });
    }, []);

    const writeRegister = useCallback(
        (name: string, value: RegisterValue): Promise<void> => {
            return invoke<void>("write_register", { name, value });
        },
        [],
    );

    const writeField = useCallback(
        (register: string, field: string, value: number): Promise<void> => {
            return invoke<void>("write_field", { register, field, value });
        },
        [],
    );

    return { registerMap, readRegister, writeRegister, writeField };
}
