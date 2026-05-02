import { useEffect, useState } from "react"
import { invoke } from "@tauri-apps/api/core"
import type { RegisterDef, RegisterValue } from "../bindings"

export function useRegisters() {
  const [registerMap, setRegisterMap] = useState<RegisterDef[]>([])

  useEffect(() => {
    invoke<RegisterDef[]>("get_register_map").then(setRegisterMap)
  }, [])

  function readRegister(name: string): Promise<RegisterValue> {
    return invoke<RegisterValue>("read_register", { name })
  }

  function writeRegister(name: string, value: RegisterValue): Promise<void> {
    return invoke<void>("write_register", { name, value })
  }

  function writeField(register: string, field: string, value: number): Promise<void> {
    return invoke<void>("write_field", { register, field, value })
  }

  return { registerMap, readRegister, writeRegister, writeField }
}