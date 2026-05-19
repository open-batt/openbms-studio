import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { BmsData } from "@/bindings/BmsData";
import { BmsDataContext } from "@/contexts/BmsDataContext";
import { MOCK_DATASETS } from "@/mocks/datasets";
import { useBmsHistory } from "./useBmsHistory";

const DS = MOCK_DATASETS.map((d) => d.bmsData);

function TestBed({ windowMs }: { windowMs: number }) {
    const { history, clear } = useBmsHistory(windowMs);
    return (
        <div>
            <span data-testid="count">{history.length}</span>
            <button type="button" data-testid="clear" onClick={clear} />
        </div>
    );
}

function ControlledWrapper({
    windowMs,
    bmsData,
}: {
    windowMs: number;
    bmsData: BmsData | null;
}) {
    return (
        <BmsDataContext.Provider value={{ bmsData, error: null }}>
            <TestBed windowMs={windowMs} />
        </BmsDataContext.Provider>
    );
}

describe("useBmsHistory", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("adds one entry for the initial bmsData", () => {
        render(<ControlledWrapper windowMs={60000} bmsData={DS[0]} />);
        expect(screen.getByTestId("count").textContent).toBe("1");
    });

    it("does not add entry when bmsData is null", () => {
        render(<ControlledWrapper windowMs={60000} bmsData={null} />);
        expect(screen.getByTestId("count").textContent).toBe("0");
    });

    it("accumulates a new entry on each bmsData change", () => {
        const { rerender } = render(
            <ControlledWrapper windowMs={60000} bmsData={DS[0]} />,
        );
        act(() => {
            rerender(<ControlledWrapper windowMs={60000} bmsData={DS[1]} />);
        });
        act(() => {
            rerender(<ControlledWrapper windowMs={60000} bmsData={DS[2]} />);
        });
        expect(screen.getByTestId("count").textContent).toBe("3");
    });

    it("prunes entries older than the window", () => {
        vi.setSystemTime(0);
        const { rerender } = render(
            <ControlledWrapper windowMs={2000} bmsData={DS[0]} />,
        );
        // t=0: 1 entry

        act(() => {
            vi.setSystemTime(1000);
            rerender(<ControlledWrapper windowMs={2000} bmsData={DS[1]} />);
        });
        // t=1000: both entries within 2000ms window → 2 entries
        expect(screen.getByTestId("count").textContent).toBe("2");

        act(() => {
            vi.setSystemTime(3000);
            rerender(<ControlledWrapper windowMs={2000} bmsData={DS[2]} />);
        });
        // t=3000: t=0 is 3000ms ago (>2000ms) → pruned; t=1000 is 2000ms ago (≤2000ms) → kept
        // result: [t=1000, t=3000] → 2 entries
        expect(screen.getByTestId("count").textContent).toBe("2");
    });

    it("prunes when windowMs shrinks", () => {
        vi.setSystemTime(0);
        const { rerender } = render(
            <ControlledWrapper windowMs={60000} bmsData={DS[0]} />,
        );
        act(() => {
            vi.setSystemTime(1000);
            rerender(<ControlledWrapper windowMs={60000} bmsData={DS[1]} />);
        });
        act(() => {
            vi.setSystemTime(2000);
            rerender(<ControlledWrapper windowMs={60000} bmsData={DS[2]} />);
        });
        // 3 entries at t=0, 1000, 2000

        act(() => {
            vi.setSystemTime(2000);
            // shrink window to 500ms — only t=2000 (0ms ago) survives
            rerender(<ControlledWrapper windowMs={500} bmsData={DS[2]} />);
        });
        expect(screen.getByTestId("count").textContent).toBe("1");
    });

    it("clear() empties the history", () => {
        const { rerender } = render(
            <ControlledWrapper windowMs={60000} bmsData={DS[0]} />,
        );
        act(() => {
            rerender(<ControlledWrapper windowMs={60000} bmsData={DS[1]} />);
        });
        act(() => {
            screen.getByTestId("clear").click();
        });
        expect(screen.getByTestId("count").textContent).toBe("0");
    });
});
