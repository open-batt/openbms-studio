import { useCallback, useEffect, useRef, useState } from "react";
import type { BmsData } from "@/bindings/BmsData";
import { useBmsDataContext } from "@/contexts/BmsDataContext";

export interface HistoryEntry {
    t: number;
    data: BmsData;
}

export function useBmsHistory(windowMs: number): {
    history: HistoryEntry[];
    clear: () => void;
} {
    const { bmsData } = useBmsDataContext();
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const windowMsRef = useRef(windowMs);

    windowMsRef.current = windowMs;

    useEffect(() => {
        if (!bmsData) return;
        const now = Date.now();
        setHistory((prev) => [
            ...prev.filter((e) => now - e.t <= windowMsRef.current),
            { t: now, data: bmsData },
        ]);
    }, [bmsData]);

    // prune when windowMs shrinks without waiting for new data
    useEffect(() => {
        const now = Date.now();
        setHistory((prev) => {
            const pruned = prev.filter((e) => now - e.t <= windowMs);
            return pruned.length !== prev.length ? pruned : prev;
        });
    }, [windowMs]);

    const clear = useCallback(() => setHistory([]), []);

    return { history, clear };
}
