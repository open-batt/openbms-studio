import { act, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SettingsProvider, useSettings } from "./SettingsContext";

function Consumer() {
    const { settings, setRefreshIntervalMs } = useSettings();
    return (
        <div>
            <span data-testid="interval">{settings.refreshIntervalMs}</span>
            <button type="button" onClick={() => setRefreshIntervalMs(5000)}>
                Set 5s
            </button>
        </div>
    );
}

describe("SettingsContext", () => {
    beforeEach(() => localStorage.clear());

    it("defaults to 1000ms", () => {
        render(
            <SettingsProvider>
                <Consumer />
            </SettingsProvider>,
        );
        expect(screen.getByTestId("interval").textContent).toBe("1000");
    });

    it("updates refreshIntervalMs", async () => {
        render(
            <SettingsProvider>
                <Consumer />
            </SettingsProvider>,
        );
        await act(() => screen.getByText("Set 5s").click());
        expect(screen.getByTestId("interval").textContent).toBe("5000");
    });

    it("persists to localStorage", async () => {
        render(
            <SettingsProvider>
                <Consumer />
            </SettingsProvider>,
        );
        await act(() => screen.getByText("Set 5s").click());
        const stored = JSON.parse(
            localStorage.getItem("openbms_settings") ?? "{}",
        );
        expect(stored.refreshIntervalMs).toBe(5000);
    });

    it("loads persisted value on mount", () => {
        localStorage.setItem(
            "openbms_settings",
            JSON.stringify({ refreshIntervalMs: 3000 }),
        );
        render(
            <SettingsProvider>
                <Consumer />
            </SettingsProvider>,
        );
        expect(screen.getByTestId("interval").textContent).toBe("3000");
    });

    it("throws outside provider", () => {
        const spy = vi.spyOn(console, "error").mockImplementation(() => {});
        expect(() => render(<Consumer />)).toThrow(
            "useSettings must be used within SettingsProvider",
        );
        spy.mockRestore();
    });
});
