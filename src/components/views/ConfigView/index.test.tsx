import { MantineProvider } from "@mantine/core";
import { render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { ConfigView } from "./index";

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

vi.mock("@tauri-apps/api/core", () => ({ invoke: vi.fn() }));
vi.mock("@tauri-apps/plugin-dialog", () => ({ save: vi.fn(), open: vi.fn() }));
vi.mock("@tauri-apps/plugin-fs", () => ({
    writeTextFile: vi.fn(),
    readTextFile: vi.fn(),
}));
vi.mock("@mantine/notifications", () => ({
    notifications: { show: vi.fn() },
}));

function renderConfigView() {
    return render(
        <MantineProvider>
            <ConfigView />
        </MantineProvider>,
    );
}

describe("ConfigView", () => {
    it("renders both action buttons", () => {
        renderConfigView();
        expect(
            screen.getByRole("button", { name: "Read from Board" }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "Load from File" }),
        ).toBeInTheDocument();
    });

    it("Save to File is disabled when no board config is loaded", () => {
        renderConfigView();
        expect(
            screen.getByRole("button", { name: "Save to File" }),
        ).toBeDisabled();
    });

    it("Write to Board is disabled when no file config is loaded", () => {
        renderConfigView();
        expect(
            screen.getByRole("button", { name: "Write to Board" }),
        ).toBeDisabled();
    });

    it("shows placeholder text in both preview panels", () => {
        renderConfigView();
        expect(screen.getByText(/No data/)).toBeInTheDocument();
        expect(screen.getByText(/No file loaded/)).toBeInTheDocument();
    });
});
