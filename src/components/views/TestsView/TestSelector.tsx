import { Button, Select, Stack } from "@mantine/core";
import type { TestDef } from "./types";

interface TestSelectorProps {
	tests: TestDef[];
	selectedId: string | null;
	onSelect: (id: string | null) => void;
	isRunning: boolean;
	onRun: () => void;
	onStop: () => void;
}

export function TestSelector({ tests, selectedId, onSelect, isRunning, onRun, onStop }: TestSelectorProps) {
	const selectData = tests.map((t) => ({ value: t.id, label: t.label }));

	return (
		<Stack gap="sm">
			<Select
				label="Select test"
				placeholder="Choose a diagnostic test..."
				data={selectData}
				value={selectedId}
				onChange={onSelect}
				disabled={isRunning}
				clearable
			/>
			{isRunning ? (
				<Button color="red" onClick={onStop}>
					Stop
				</Button>
			) : (
				<Button color="green" disabled={selectedId === null} onClick={onRun}>
					Run
				</Button>
			)}
		</Stack>
	);
}
