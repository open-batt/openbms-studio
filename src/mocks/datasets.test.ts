import { describe, expect, it } from "vitest";
import { MOCK_DATASETS } from "./datasets";

describe("MOCK_DATASETS", () => {
	it("has 4 entries", () => {
		expect(MOCK_DATASETS).toHaveLength(4);
	});

	it("each dataset has all required BmsData fields", () => {
		for (const ds of MOCK_DATASETS) {
			const d = ds.bmsData;
			expect(typeof d.relative_soc).toBe("number");
			expect(typeof d.voltage_mv).toBe("number");
			expect(typeof d.current_ma).toBe("number");
			expect(typeof d.temperature_dk).toBe("number");
			expect(typeof d.battery_status).toBe("number");
			expect(d.cell_voltages_mv).toHaveLength(7);
			expect(d.cell_temperatures).toHaveLength(7);
			expect(d.cell_soc).toHaveLength(7);
		}
	});

	it("dataset 3 (protection fault) has OTP and OCP bits set", () => {
		const status = MOCK_DATASETS[3].bmsData.battery_status;
		expect(status & (1 << 12)).toBeTruthy(); // OTP
		expect(status & (1 << 14)).toBeTruthy(); // OCP
	});

	it("dataset 2 (low battery) has UVP bit set", () => {
		const status = MOCK_DATASETS[2].bmsData.battery_status;
		expect(status & (1 << 11)).toBeTruthy(); // UVP
	});

	it("datasets 0 and 1 have no protection flags set", () => {
		expect(MOCK_DATASETS[0].bmsData.battery_status).toBe(0);
		expect(MOCK_DATASETS[1].bmsData.battery_status).toBe(0);
	});
});
