import { render, screen, act } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { MockBmsDataProvider, useBmsDataContext } from "./BmsDataContext";
import { MOCK_DATASETS } from "@/mocks/datasets";

function DataDisplay() {
    const { bmsData } = useBmsDataContext();
    return <div data-testid="soc">{bmsData?.relative_soc ?? "null"}</div>;
}

describe("MockBmsDataProvider", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("provides the first dataset immediately", () => {
        render(
            <MockBmsDataProvider>
                <DataDisplay />
            </MockBmsDataProvider>,
        );
        expect(screen.getByTestId("soc").textContent).toBe(
            String(MOCK_DATASETS[0].bmsData.relative_soc),
        );
    });

    it("advances to next dataset after 5 seconds", () => {
        render(
            <MockBmsDataProvider>
                <DataDisplay />
            </MockBmsDataProvider>,
        );
        act(() => {
            vi.advanceTimersByTime(5000);
        });
        expect(screen.getByTestId("soc").textContent).toBe(
            String(MOCK_DATASETS[1].bmsData.relative_soc),
        );
    });

    it("wraps back to dataset 0 after all datasets", () => {
        render(
            <MockBmsDataProvider>
                <DataDisplay />
            </MockBmsDataProvider>,
        );
        act(() => {
            vi.advanceTimersByTime(5000 * MOCK_DATASETS.length);
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
