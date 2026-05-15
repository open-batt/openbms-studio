import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Grid } from "@mantine/core";
import { ValueRegister } from "@/components/ValueRegister";
import { BitFlagRegister } from "@/components/BitFlagRegister";
import type { RegisterEntry } from "@/components/ValueRegister";
import type { RegisterDef } from "@/bindings";

const VALUE_GROUPS: Record<string, string[]> = {
	Voltages:     ["Voltage", "ChargingVoltage", "DesignVoltage"],
	Currents:     ["Current", "AverageCurrent", "ChargingCurrent", "AtRate"],
	Temperatures: ["Temperature"],
	Capacities:   ["RemainingCapacity", "FullChargeCapacity", "DesignCapacity"],
	Timers:       ["RunTimeToEmpty", "AverageTimeToEmpty", "AverageTimeToFull"],
	Percentages:  ["RelativeStateOfCharge", "AbsoluteStateOfCharge", "CycleCount"],
};

const BIT_REGISTER_NAMES = ["BatteryStatus", "FETStatus", "BalancingStatus", "BalancingControl"];

export function RegistersView() {
	const [regMap, setRegMap] = useState<Map<string, RegisterDef>>(new Map());

	useEffect(() => {
		invoke<RegisterDef[]>("get_register_map")
			.then((defs) => setRegMap(new Map(defs.map((d) => [d.name, d]))))
			.catch(console.error);
	}, []);

	function toEntries(names: string[]): RegisterEntry[] {
		return names.flatMap((n) => {
			const def = regMap.get(n);
			return def ? [{ def, value: null }] : [];
		});
	}

	return (
		<Grid>
			{Object.entries(VALUE_GROUPS).map(([title, names]) => (
				<Grid.Col key={title} span={6}>
					<ValueRegister title={title} registers={toEntries(names)} />
				</Grid.Col>
			))}
			<Grid.Col span={12}>
				<BitFlagRegister registers={toEntries(BIT_REGISTER_NAMES)} />
			</Grid.Col>
		</Grid>
	);
}
