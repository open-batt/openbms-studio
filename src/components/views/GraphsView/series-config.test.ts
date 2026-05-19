import { describe, expect, it } from "vitest";
import {
    CHART_GROUPS,
    cellTempToCelsius,
    defaultVisibilityMap,
    tempDkToCelsius,
} from "./series-config";

describe("tempDkToCelsius", () => {
    it("converts 2983 dk to ~25.15°C", () => {
        expect(tempDkToCelsius(2983)).toBeCloseTo(25.15, 1);
    });

    it("converts 2731 dk to ~0.0°C", () => {
        expect(tempDkToCelsius(2731)).toBeCloseTo(0.0, 1);
    });
});

describe("cellTempToCelsius", () => {
    it("converts 250 (0.1°C units) to 25.0°C", () => {
        expect(cellTempToCelsius(250)).toBe(25.0);
    });

    it("converts -50 to -5.0°C", () => {
        expect(cellTempToCelsius(-50)).toBe(-5.0);
    });
});

describe("CHART_GROUPS", () => {
    it("has exactly 4 groups", () => {
        expect(CHART_GROUPS).toHaveLength(4);
    });

    it("Voltages group has 8 series (pack + 7 cells)", () => {
        expect(CHART_GROUPS[0].series).toHaveLength(8);
    });

    it("Temperatures group has 8 series (pack + 7 cells)", () => {
        expect(CHART_GROUPS[1].series).toHaveLength(8);
    });

    it("SoC group has 9 series (relative + absolute + 7 cells)", () => {
        expect(CHART_GROUPS[2].series).toHaveLength(9);
    });

    it("Currents group has 2 series", () => {
        expect(CHART_GROUPS[3].series).toHaveLength(2);
    });

    it("all series IDs are unique", () => {
        const ids = CHART_GROUPS.flatMap((g) => g.series.map((s) => s.id));
        expect(new Set(ids).size).toBe(ids.length);
    });
});

describe("defaultVisibilityMap", () => {
    it("sets all series to true", () => {
        const map = defaultVisibilityMap();
        const allTrue = Object.values(map).every((v) => v === true);
        expect(allTrue).toBe(true);
    });

    it("covers all series IDs", () => {
        const map = defaultVisibilityMap();
        const allIds = CHART_GROUPS.flatMap((g) => g.series.map((s) => s.id));
        for (const id of allIds) {
            expect(map).toHaveProperty(id);
        }
    });
});
