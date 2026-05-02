import { useEffect, useState } from "react"
import { listen } from "@tauri-apps/api/event"
import type { BmsData } from "../bindings/BmsData"
import type { CommsError } from "../bindings/CommsError"

export function useBmsData() {
  const [data, setData] = useState<BmsData | null>(null)
  const [error, setError] = useState<CommsError | null>(null)

  useEffect(() => {
    const unlistenData = listen<BmsData>("bms_data", (event) => {
      setData(event.payload)
      setError(null)
    })

    const unlistenError = listen<CommsError>("comms_error", (event) => {
      setError(event.payload)
    })

    return () => {
      unlistenData.then((f) => f())
      unlistenError.then((f) => f())
    }
  }, [])

  return { data, error }
}