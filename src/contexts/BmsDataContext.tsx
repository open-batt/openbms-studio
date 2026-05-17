import {
    createContext,
    useContext,
    useState,
    useEffect,
    type ReactNode,
} from "react";
import { listen } from "@tauri-apps/api/event";
import type { BmsData } from "@/bindings/BmsData";

interface BmsDataContextType {
    bmsData: BmsData | null;
    error: string | null;
}

const BmsDataContext = createContext<BmsDataContextType | null>(null);

export const BmsDataProvider = ({ children }: { children: ReactNode }) => {
    const [bmsData, setBmsData] = useState<BmsData | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let unlistenData: (() => void) | null = null;
        let unlistenError: (() => void) | null = null;

        const setupListeners = async () => {
            try {
                unlistenData = await listen<BmsData>("bms_data", (event) => {
                    setBmsData(event.payload);
                    setError(null);
                });

                unlistenError = await listen<string>("comms_error", (event) => {
                    setError(event.payload);
                });
            } catch (err) {
                console.error("Failed to setup event listeners:", err);
            }
        };

        setupListeners();

        return () => {
            unlistenData?.();
            unlistenError?.();
        };
    }, []);

    return (
        <BmsDataContext.Provider value={{ bmsData, error }}>
            {children}
        </BmsDataContext.Provider>
    );
};

export const useBmsData = (): BmsDataContextType => {
    const context = useContext(BmsDataContext);
    if (!context) {
        throw new Error("useBmsData must be used within a BmsDataProvider");
    }
    return context;
};
