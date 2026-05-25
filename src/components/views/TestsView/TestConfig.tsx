import { NumberInput, Stack, Title } from "@mantine/core";
import type { TestDef } from "./types";

interface TestConfigProps {
	test: TestDef | null;
	values: Record<string, number>;
	onChange: (key: string, value: number) => void;
	disabled: boolean;
}

export function TestConfig({ test, values, onChange, disabled }: TestConfigProps) {
	if (!test || test.config.length === 0) return null;

	return (
		<Stack gap="xs">
			<Title order={6} c="dimmed">
				Test Configuration
			</Title>
			{test.config.map((field) => (
				<NumberInput
					key={field.key}
					label={field.label}
					suffix={field.unit ? ` ${field.unit}` : ""}
					value={values[field.key] ?? field.default}
					onChange={(v) => onChange(field.key, typeof v === "number" ? v : field.default)}
					disabled={disabled}
					min={0}
				/>
			))}
		</Stack>
	);
}
