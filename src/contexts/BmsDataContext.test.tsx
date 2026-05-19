import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MOCK_DATASETS } from "@/mocks/datasets";
import { MockBmsDataProvider, useBmsDataContext } from "./BmsDataContext";
import { SettingsProvider } from "./SettingsContext";

const DEFAULT_INTERVAL_MS = 1000;

function DataDisplay() {
    const { bmsData } = useBmsDataContext();
    return <div data-testid="soc">{bmsData?.relative_soc ?? "null"}</div>;
}

function Wrapper({ children }: { children: React.ReactNode }) {
    return (
        <SettingsProvider>
            <MockBmsDataProvider>{children}</MockBmsDataProvider>
        </SettingsProvider>
    );
}

describe("MockBmsDataProvider", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("provides the first dataset immediately", () => {
        render(<DataDisplay />, { wrapper: Wrapper });
        expect(screen.getByTestId("soc").textContent).toBe(
            String(MOCK_DATASETS[0].bmsData.relative_soc),
        );
    });

    it("advances to next dataset after 1 second", () => {
        render(<DataDisplay />, { wrapper: Wrapper });
        act(() => {
            vi.advanceTimersByTime(DEFAULT_INTERVAL_MS);
        });
        expect(screen.getByTestId("soc").textContent).toBe(
            String(MOCK_DATASETS[1].bmsData.relative_soc),
        );
    });

    it("wraps back to dataset 0 after all datasets", () => {
        render(<DataDisplay />, { wrapper: Wrapper });
        act(() => {
            vi.advanceTimersByTime(DEFAULT_INTERVAL_MS * MOCK_DATASETS.length);
        });
        expect(screen.getByTestId("soc").textContent).toBe(
            String(MOCK_DATASETS[0].bmsData.relative_soc),
        );
    });
});

describe("useBmsDataContext", () => {
    it("throws when used outside a provider", () => {
        // Suppress React's error boundary console output
        const spy = vi.spyOn(console, "error").mockImplementation(() => {});
        expect(() => render(<DataDisplay />)).toThrow(
            "useBmsDataContext must be used within a BmsDataProvider",
        );
        spy.mockRestore();
    });
});
