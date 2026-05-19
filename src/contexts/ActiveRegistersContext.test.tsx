import { act, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
    ActiveRegistersProvider,
    useRegisterSubscription,
} from "./ActiveRegistersContext";
import { BmsDataContext } from "./BmsDataContext";

vi.mock("@tauri-apps/api/core", () => ({
    invoke: vi.fn(async (cmd: string) => {
        if (cmd === "read_register") return { Word: 42 };
        return null;
    }),
}));

const mockBmsContextValue = { bmsData: null, error: null };

function wrapper({ children }: { children: React.ReactNode }) {
    return (
        <BmsDataContext.Provider value={mockBmsContextValue}>
            <ActiveRegistersProvider>{children}</ActiveRegistersProvider>
        </BmsDataContext.Provider>
    );
}

function SubscriberComponent({ names }: { names: string[] }) {
    const values = useRegisterSubscription(names);
    return (
        <div>
            {names.map((n) => (
                <span key={n} data-testid={n}>
                    {values.get(n) ? JSON.stringify(values.get(n)) : "null"}
                </span>
            ))}
        </div>
    );
}

describe("ActiveRegistersContext", () => {
    beforeEach(() => vi.clearAllMocks());

    it("fetches static register on subscribe", async () => {
        render(<SubscriberComponent names={["DesignCapacity"]} />, { wrapper });
        await waitFor(() =>
            expect(screen.getByTestId("DesignCapacity").textContent).toBe(
                JSON.stringify({ Word: 42 }),
            ),
        );
    });

    it("does not invoke for live registers", async () => {
        const { invoke } = await import("@tauri-apps/api/core");
        render(<SubscriberComponent names={["Voltage"]} />, { wrapper });
        await act(async () => {});
        expect(invoke).not.toHaveBeenCalledWith(
            "read_register",
            expect.anything(),
        );
    });

    it("caches static value — does not re-fetch on re-subscribe", async () => {
        const { invoke } = await import("@tauri-apps/api/core");

        // Render two subscribers for the same name inside ONE shared provider.
        // Only one invoke should happen regardless of how many subscribers exist.
        render(
            <BmsDataContext.Provider value={mockBmsContextValue}>
                <ActiveRegistersProvider>
                    <SubscriberComponent names={["DesignCapacity"]} />
                    <SubscriberComponent names={["DesignCapacity"]} />
                </ActiveRegistersProvider>
            </BmsDataContext.Provider>,
        );
        await waitFor(() =>
            expect(
                screen.getAllByTestId("DesignCapacity")[0].textContent,
            ).not.toBe("null"),
        );
        // Two subscribers for the same name → only one fetch
        expect(invoke).toHaveBeenCalledTimes(1);
    });

    it("throws outside provider", () => {
        const spy = vi.spyOn(console, "error").mockImplementation(() => {});
        expect(() =>
            render(<SubscriberComponent names={["Voltage"]} />),
        ).toThrow(
            "useRegisterSubscription must be used within ActiveRegistersProvider",
        );
        spy.mockRestore();
    });
});
