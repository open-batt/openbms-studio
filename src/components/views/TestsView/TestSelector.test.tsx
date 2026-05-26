import { MantineProvider } from "@mantine/core";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { TestSelector } from "./TestSelector";
import type { TestDef } from "./types";

beforeAll(() => {
    Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: vi.fn().mockImplementation((query: string) => ({
            matches: false,
            media: query,
            onchange: null,
            addListener: vi.fn(),
            removeListener: vi.fn(),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
        })),
    });
    global.ResizeObserver = class ResizeObserver {
        observe() {}
        unobserve() {}
        disconnect() {}
    };
});

const TESTS: TestDef[] = [
    { id: "cell_voltage_balance", label: "Cell Voltage Balance", config: [] },
    { id: "isolation_resistance", label: "Isolation Resistance", config: [] },
];

function renderSelector(
    overrides: Partial<Parameters<typeof TestSelector>[0]> = {},
) {
    const props = {
        tests: TESTS,
        selectedId: null,
        onSelect: vi.fn(),
        isRunning: false,
        onRun: vi.fn(),
        onStop: vi.fn(),
        ...overrides,
    };
    return render(
        <MantineProvider>
            <TestSelector {...props} />
        </MantineProvider>,
    );
}

describe("TestSelector", () => {
    it("renders the Run button disabled when no test is selected", () => {
        renderSelector({ selectedId: null, isRunning: false });
        expect(screen.getByRole("button", { name: /run/i })).toBeDisabled();
    });

    it("renders the Run button enabled when a test is selected", () => {
        renderSelector({
            selectedId: "cell_voltage_balance",
            isRunning: false,
        });
        expect(screen.getByRole("button", { name: /run/i })).not.toBeDisabled();
    });

    it("shows Stop button when running", () => {
        renderSelector({ selectedId: "cell_voltage_balance", isRunning: true });
        expect(
            screen.getByRole("button", { name: /stop/i }),
        ).toBeInTheDocument();
        expect(
            screen.queryByRole("button", { name: /run/i }),
        ).not.toBeInTheDocument();
    });

    it("calls onRun when Run is clicked", () => {
        const onRun = vi.fn();
        renderSelector({
            selectedId: "cell_voltage_balance",
            isRunning: false,
            onRun,
        });
        fireEvent.click(screen.getByRole("button", { name: /run/i }));
        expect(onRun).toHaveBeenCalledOnce();
    });

    it("calls onStop when Stop is clicked", () => {
        const onStop = vi.fn();
        renderSelector({
            selectedId: "cell_voltage_balance",
            isRunning: true,
            onStop,
        });
        fireEvent.click(screen.getByRole("button", { name: /stop/i }));
        expect(onStop).toHaveBeenCalledOnce();
    });
});
