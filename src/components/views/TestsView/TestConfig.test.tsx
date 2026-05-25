import { MantineProvider } from "@mantine/core";
import { render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { TestConfig } from "./TestConfig";
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

const TEST_WITH_CONFIG: TestDef = {
    id: "cell_voltage_balance",
    label: "Cell Voltage Balance",
    config: [
        { key: "maxDelta", label: "Max Delta", unit: "mV", default: 5 },
        { key: "timeout", label: "Timeout", unit: "s", default: 30 },
    ],
};

const TEST_NO_CONFIG: TestDef = {
    id: "isolation_resistance",
    label: "Isolation Resistance",
    config: [],
};

function renderConfig(
    test: TestDef | null,
    values: Record<string, number> = {},
    disabled = false,
) {
    return render(
        <MantineProvider>
            <TestConfig
                test={test}
                values={values}
                onChange={vi.fn()}
                disabled={disabled}
            />
        </MantineProvider>,
    );
}

describe("TestConfig", () => {
    it("renders nothing when test is null", () => {
        renderConfig(null);
        expect(screen.queryByRole("textbox")).toBeNull();
        expect(screen.queryByText(/test configuration/i)).toBeNull();
    });

    it("renders nothing when test has no config fields", () => {
        renderConfig(TEST_NO_CONFIG);
        expect(screen.queryByRole("textbox")).toBeNull();
        expect(screen.queryByText(/test configuration/i)).toBeNull();
    });

    it("renders a NumberInput for each config field", () => {
        renderConfig(TEST_WITH_CONFIG, { maxDelta: 5, timeout: 30 });
        expect(screen.getByLabelText(/max delta/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/timeout/i)).toBeInTheDocument();
    });

    it("inputs are disabled when disabled prop is true", () => {
        renderConfig(TEST_WITH_CONFIG, { maxDelta: 5, timeout: 30 }, true);
        const inputs = screen.getAllByRole("textbox");
        for (const input of inputs) {
            expect(input).toBeDisabled();
        }
    });
});
