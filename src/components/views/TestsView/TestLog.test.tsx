import { MantineProvider } from "@mantine/core";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { TestLog } from "./TestLog";
import type { LogEntry } from "./types";

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

function renderTestLog(logs: LogEntry[], onClear = vi.fn()) {
    return render(
        <MantineProvider>
            <TestLog logs={logs} onClear={onClear} />
        </MantineProvider>,
    );
}

const SAMPLE_LOGS: LogEntry[] = [
    {
        id: "1",
        timestamp: new Date("2025-01-01T10:00:00.123Z"),
        severity: "info",
        message: "Test started",
    },
    {
        id: "2",
        timestamp: new Date("2025-01-01T10:00:01.456Z"),
        severity: "warn",
        message: "Voltage low",
    },
    {
        id: "3",
        timestamp: new Date("2025-01-01T10:00:02.789Z"),
        severity: "error",
        message: "FAIL — over temp",
    },
];

describe("TestLog", () => {
    it("shows empty state placeholder when no logs", () => {
        renderTestLog([]);
        expect(screen.getByText(/No logs yet/)).toBeInTheDocument();
    });

    it("renders a row for each log entry", () => {
        renderTestLog(SAMPLE_LOGS);
        expect(screen.getByText("Test started")).toBeInTheDocument();
        expect(screen.getByText("Voltage low")).toBeInTheDocument();
        expect(screen.getByText("FAIL — over temp")).toBeInTheDocument();
    });

    it("renders severity badges", () => {
        renderTestLog(SAMPLE_LOGS);
        expect(screen.getByText("info")).toBeInTheDocument();
        expect(screen.getByText("warn")).toBeInTheDocument();
        expect(screen.getByText("error")).toBeInTheDocument();
    });

    it("calls onClear when Clear button is clicked", () => {
        const onClear = vi.fn();
        renderTestLog(SAMPLE_LOGS, onClear);
        fireEvent.click(screen.getByRole("button", { name: /clear/i }));
        expect(onClear).toHaveBeenCalledOnce();
    });

    it("scrolls to bottom when new log entries are added", () => {
        HTMLElement.prototype.scrollTo = () => {};
        const scrollToSpy = vi
            .spyOn(HTMLElement.prototype, "scrollTo")
            .mockImplementation(() => {});
        const { rerender } = renderTestLog(SAMPLE_LOGS.slice(0, 1));
        rerender(
            <MantineProvider>
                <TestLog logs={SAMPLE_LOGS} onClear={vi.fn()} />
            </MantineProvider>,
        );
        expect(scrollToSpy).toHaveBeenCalled();
        scrollToSpy.mockRestore();
    });
});
