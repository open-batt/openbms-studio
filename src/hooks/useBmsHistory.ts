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
	const bufferRef = useRef<HistoryEntry[]>([]);
	const windowMsRef = useRef(windowMs);
	const [, forceUpdate] = useState(0);

	// keep windowMsRef current so the bmsData effect always prunes to latest window
	windowMsRef.current = windowMs;

	// append a new entry whenever bmsData changes
	useEffect(() => {
		if (!bmsData) return;
		const now = Date.now();
		bufferRef.current = [
			...bufferRef.current.filter((e) => now - e.t <= windowMsRef.current),
			{ t: now, data: bmsData },
		];
		forceUpdate((n) => n + 1);
	}, [bmsData]);

	// prune existing buffer when windowMs shrinks (without waiting for new data)
	useEffect(() => {
		const now = Date.now();
		const pruned = bufferRef.current.filter((e) => now - e.t <= windowMs);
		if (pruned.length !== bufferRef.current.length) {
			bufferRef.current = pruned;
			forceUpdate((n) => n + 1);
		}
	}, [windowMs]);

	const clear = useCallback(() => {
		bufferRef.current = [];
		forceUpdate((n) => n + 1);
	}, []);

	return { history: [...bufferRef.current], clear };
}
