import { listen } from "@tauri-apps/api/event";
import { useEffect, useState } from "react";
import type { BmsData } from "../bindings/BmsData";
import type { CommsError } from "../bindings/CommsError";

export function useBmsData() {
    const [data, setData] = useState<BmsData | null>(null);
    const [error, setError] = useState<CommsError | null>(null);

    useEffect(() => {
        let cancelled = false;
        let unlistenData: (() => void) | undefined;
        let unlistenError: (() => void) | undefined;

        listen<BmsData>("bms_data", (event) => {
            setData(event.payload);
            setError(null);
        }).then((fn) => {
            if (cancelled) fn();
            else unlistenData = fn;
        });

        listen<CommsError>("comms_error", (event) => {
            setError(event.payload);
        }).then((fn) => {
            if (cancelled) fn();
            else unlistenError = fn;
        });

        return () => {
            cancelled = true;
            unlistenData?.();
            unlistenError?.();
        };
    }, []);

    return { data, error };
}
