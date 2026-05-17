import {
    createContext,
    useContext,
    useState,
    useEffect,
    type ReactNode,
} from "react";
import { listen } from "@tauri-apps/api/event";
import type { BmsData } from "@/bindings/BmsData";
import { MOCK_DATASETS } from "@/mocks/datasets";

const MOCK_DATA_CYCLE_MS = 5000;

interface BmsDataContextType {
    bmsData: BmsData | null;
    error: string | null;
}

const BmsDataContext = createContext<BmsDataContextType | null>(null);

export const TauriBmsDataProvider = ({ children }: { children: ReactNode }) => {
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

export const MockBmsDataProvider = ({ children }: { children: ReactNode }) => {
    const [idx, setIdx] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIdx((i) => (i + 1) % MOCK_DATASETS.length);
        }, MOCK_DATA_CYCLE_MS);

        return () => clearInterval(interval);
    }, []);

    return (
        <BmsDataContext.Provider
            value={{ bmsData: MOCK_DATASETS[idx].bmsData, error: null }}
        >
            {children}
        </BmsDataContext.Provider>
    );
};

// Default export for backward compatibility
export const BmsDataProvider = TauriBmsDataProvider;

export const useBmsDataContext = (): BmsDataContextType => {
    const context = useContext(BmsDataContext);
    if (!context) {
        throw new Error(
            "useBmsDataContext must be used within a BmsDataProvider",
        );
    }
    return context;
};
