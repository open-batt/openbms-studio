import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BmsDataProvider, useBmsData } from "./BmsDataContext";
import type { BmsData } from "@/bindings/BmsData";

// Mock the tauri events
vi.mock("@tauri-apps/api/event");

describe("BmsDataContext", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should provide default bms data", () => {
        const TestComponent = () => {
            const { bmsData, error } = useBmsData();
            return (
                <div>
                    <div data-testid="error">
                        {error ? "error" : "no-error"}
                    </div>
                    <div data-testid="data">
                        {bmsData ? "has-data" : "no-data"}
                    </div>
                </div>
            );
        };

        render(
            <BmsDataProvider>
                <TestComponent />
            </BmsDataProvider>,
        );

        expect(screen.getByTestId("error")).toHaveTextContent("no-error");
        expect(screen.getByTestId("data")).toHaveTextContent("no-data");
    });

    it("should update data when bms_data event fires", async () => {
        const mockData: BmsData = {
            cell_voltages: new Array(13).fill(3.2),
            pack_voltage: 41.6,
            current: 100,
            temperature: 25.5,
            soc: 50,
            soh: 95,
            state: "charging",
        };

        let fireEvent: ((data: BmsData) => void) | null = null;

        const { listen } = await import("@tauri-apps/api/event");
        vi.mocked(listen).mockImplementation(
            (event: string, handler: (data: { payload: BmsData }) => void) => {
                if (event === "bms_data") {
                    fireEvent = (data: BmsData) => handler({ payload: data });
                }
                return Promise.resolve(() => {});
            },
        );

        const TestComponent = () => {
            const { bmsData } = useBmsData();
            return (
                <div data-testid="voltage">
                    {bmsData?.pack_voltage || "no-voltage"}
                </div>
            );
        };

        render(
            <BmsDataProvider>
                <TestComponent />
            </BmsDataProvider>,
        );

        expect(screen.getByTestId("voltage")).toHaveTextContent("no-voltage");

        if (fireEvent) {
            fireEvent(mockData);
            await waitFor(() => {
                expect(screen.getByTestId("voltage")).toHaveTextContent("41.6");
            });
        }
    });

    it("should handle comms_error event", async () => {
        let fireError: ((message: string) => void) | null = null;

        const { listen } = await import("@tauri-apps/api/event");
        vi.mocked(listen).mockImplementation(
            (event: string, handler: (data: { payload: string }) => void) => {
                if (event === "comms_error") {
                    fireError = (message: string) =>
                        handler({ payload: message });
                }
                return Promise.resolve(() => {});
            },
        );

        const TestComponent = () => {
            const { error } = useBmsData();
            return <div data-testid="error-message">{error || "no-error"}</div>;
        };

        render(
            <BmsDataProvider>
                <TestComponent />
            </BmsDataProvider>,
        );

        expect(screen.getByTestId("error-message")).toHaveTextContent(
            "no-error",
        );

        if (fireError) {
            fireError("Connection lost");
            await waitFor(() => {
                expect(screen.getByTestId("error-message")).toHaveTextContent(
                    "Connection lost",
                );
            });
        }
    });

    it("should throw error when useBmsData is used outside provider", () => {
        const TestComponent = () => {
            useBmsData();
            return <div>Test</div>;
        };

        // Suppress console.error for this test
        const consoleSpy = vi.spyOn(console, "error").mockImplementation();

        expect(() => {
            render(<TestComponent />);
        }).toThrow("useBmsData must be used within a BmsDataProvider");

        consoleSpy.mockRestore();
    });
});
