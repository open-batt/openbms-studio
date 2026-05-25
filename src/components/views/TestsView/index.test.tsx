import { MantineProvider } from "@mantine/core";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { TestsView } from "./index";

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

vi.mock("@/mocks/tests", async () => {
	const actual = await vi.importActual<typeof import("@/mocks/tests")>("@/mocks/tests");
	return {
		...actual,
		runMockTest: vi.fn((_id, _onLog, onDone) => {
			onDone();
			return vi.fn();
		}),
	};
});

function renderTestsView() {
	return render(
		<MantineProvider>
			<TestsView />
		</MantineProvider>,
	);
}

describe("TestsView", () => {
	it("renders the test selector dropdown", () => {
		renderTestsView();
		expect(screen.getByText(/select test/i)).toBeInTheDocument();
	});

	it("shows the log empty state on mount", () => {
		renderTestsView();
		expect(screen.getByText(/no logs yet/i)).toBeInTheDocument();
	});

	it("Run button is disabled before selecting a test", () => {
		renderTestsView();
		expect(screen.getByRole("button", { name: /run/i })).toBeDisabled();
	});

	it("shows config fields when a test with config is selected", () => {
		renderTestsView();
		const combobox = screen.getByRole("combobox");
		fireEvent.click(combobox);
		const option = screen.getByText("Cell Voltage Balance");
		fireEvent.click(option);
		expect(screen.getByLabelText(/max delta/i)).toBeInTheDocument();
	});
});
