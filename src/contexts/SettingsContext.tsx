import { createContext, type ReactNode, useContext, useState } from "react";

const STORAGE_KEY = "openbms_settings";
const DEFAULT_REFRESH_MS = 1000;

interface Settings {
    refreshIntervalMs: number;
}

interface SettingsContextType {
    settings: Settings;
    setRefreshIntervalMs: (ms: number) => void;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

function loadSettings(): Settings {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) return JSON.parse(stored);
    } catch {}
    return { refreshIntervalMs: DEFAULT_REFRESH_MS };
}

export function SettingsProvider({ children }: { children: ReactNode }) {
    const [settings, setSettings] = useState<Settings>(loadSettings);

    function setRefreshIntervalMs(ms: number) {
        const next = { ...settings, refreshIntervalMs: ms };
        setSettings(next);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    }

    return (
        <SettingsContext.Provider value={{ settings, setRefreshIntervalMs }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings(): SettingsContextType {
    const ctx = useContext(SettingsContext);
    if (!ctx)
        throw new Error("useSettings must be used within SettingsProvider");
    return ctx;
}
