import { describe, expect, it } from "vitest";
import { formatTemperature } from "./format-temperature";

describe("formatTemperature", () => {
	it("converts deci-kelvin to a celsius string", () => {
		// 3000 dk = 300.0 K = 300.0 - 273.15 = 26.85 °C → "26.9 °C"
		expect(formatTemperature(3000)).toBe("26.9 °C");
	});

	it("handles absolute zero (0 dk = -273.1 °C)", () => {
		// 0 dk = 0.0 K = 0.0 - 273.15 = -273.15 °C → "-273.1 °C" (banker's rounding)
		expect(formatTemperature(0)).toBe("-273.1 °C");
	});

	it("formats to one decimal place", () => {
		// 2981 dk = 298.1 K = 298.1 - 273.15 = 24.95 °C → "25.0 °C"
		expect(formatTemperature(2981)).toBe("25.0 °C");
	});

	it("does not display negative zero", () => {
		// 2731 dk = 273.1 K = -0.05 °C — without + 0 coercion toFixed(1) returns "-0.0"
		expect(formatTemperature(2731)).toBe("0.0 °C");
	});
});
