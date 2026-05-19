import { invoke } from "@tauri-apps/api/core";
import {
    createContext,
    type ReactNode,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import type { RegisterValue } from "@/bindings";
import { useBmsDataContext } from "@/contexts/BmsDataContext";
import { bmsDataToRegisterValues } from "@/lib/bms-data-to-register-values";

// Register names whose values come from the BmsData Tauri event.
// These are never fetched individually via invoke.
const LIVE_REGISTER_NAMES = new Set([
    "Temperature",
    "Voltage",
    "Current",
    "AverageCurrent",
    "RelativeStateOfCharge",
    "AbsoluteStateOfCharge",
    "RemainingCapacity",
    "FullChargeCapacity",
    "CycleCount",
    "RunTimeToEmpty",
    "AverageTimeToEmpty",
    "AverageTimeToFull",
    "BatteryStatus",
    "FETStatus",
    "BalancingStatus",
    "CellVoltage",
    "CellTemperature",
    "CellSoC",
    "AtRate",
    "AtRateTimeToFull",
    "AtRateTimeToEmpty",
    "AtRateOK",
    "ChargingCurrent",
    "ChargingVoltage",
    "FETState",
    "BalancingControl",
    "CellSoH",
    "CellRemainingCapacity",
]);

interface ActiveRegistersContextType {
    registerValues: Map<string, RegisterValue>;
    subscribe: (names: string[]) => void;
    unsubscribe: (names: string[]) => void;
}

export const ActiveRegistersContext =
    createContext<ActiveRegistersContextType | null>(null);

export function ActiveRegistersProvider({ children }: { children: ReactNode }) {
    const { bmsData } = useBmsDataContext();
    const [staticValues, setStaticValues] = useState<
        Map<string, RegisterValue>
    >(new Map());
    // Track which static names have been fetched (or are in-flight).
    // Ref so changes don't trigger re-renders.
    const fetchedRef = useRef<Set<string>>(new Set());

    const subscribe = useCallback((names: string[]) => {
        const toFetch = names.filter(
            (n) => !LIVE_REGISTER_NAMES.has(n) && !fetchedRef.current.has(n),
        );
        if (toFetch.length === 0) return;

        for (const n of toFetch) fetchedRef.current.add(n);

        Promise.allSettled(
            toFetch.map((name) =>
                invoke<RegisterValue>("read_register", { name }).then(
                    (value) => ({
                        name,
                        value,
                    }),
                ),
            ),
        ).then((results) => {
            const updates = new Map<string, RegisterValue>();
            for (const r of results) {
                if (r.status === "fulfilled" && r.value.value != null) {
                    updates.set(r.value.name, r.value.value);
                }
            }
            if (updates.size > 0) {
                setStaticValues((prev) => new Map([...prev, ...updates]));
            }
        });
    }, []);

    // unsubscribe is a no-op: static values stay cached so re-expanding a section
    // shows data instantly without a new fetch.
    const unsubscribe = useCallback((_names: string[]) => {}, []);

    // Live values always override static ones.
    const registerValues = useMemo<Map<string, RegisterValue>>(() => {
        const live = bmsData
            ? bmsDataToRegisterValues(bmsData)
            : new Map<string, RegisterValue>();
        return new Map([...staticValues, ...live]);
    }, [bmsData, staticValues]);

    return (
        <ActiveRegistersContext.Provider
            value={{ registerValues, subscribe, unsubscribe }}
        >
            {children}
        </ActiveRegistersContext.Provider>
    );
}

export function useRegisterSubscription(
    names: string[],
): Map<string, RegisterValue> {
    const ctx = useContext(ActiveRegistersContext);
    if (!ctx)
        throw new Error(
            "useRegisterSubscription must be used within ActiveRegistersProvider",
        );

    const namesKey = names.join(",");

    // biome-ignore lint/correctness/useExhaustiveDependencies: namesKey encodes names; ctx.subscribe/unsubscribe are stable callbacks
    useEffect(() => {
        ctx.subscribe(names);
        return () => ctx.unsubscribe(names);
    }, [namesKey]);

    // biome-ignore lint/correctness/useExhaustiveDependencies: namesKey encodes names; names array is iterated intentionally inside memo
    return useMemo(() => {
        const result = new Map<string, RegisterValue>();
        for (const name of names) {
            const v = ctx.registerValues.get(name);
            if (v !== undefined) result.set(name, v);
        }
        return result;
    }, [ctx.registerValues, namesKey]);
}
