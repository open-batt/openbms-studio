import { Grid } from "@mantine/core";
import { useCallback, useRef, useState } from "react";
import { MOCK_TESTS, runMockTest } from "@/mocks/tests";
import { TestConfig } from "./TestConfig";
import { TestLog } from "./TestLog";
import { TestSelector } from "./TestSelector";
import type { LogEntry, TestDef } from "./types";

export function TestsView() {
	const [selectedTestId, setSelectedTestId] = useState<string | null>(null);
	const [configValues, setConfigValues] = useState<Record<string, number>>({});
	const [isRunning, setIsRunning] = useState(false);
	const [logs, setLogs] = useState<LogEntry[]>([]);
	const cancelRef = useRef<(() => void) | null>(null);

	const selectedTest: TestDef | null =
		MOCK_TESTS.find((t) => t.id === selectedTestId) ?? null;

	function handleSelect(id: string | null) {
		setSelectedTestId(id);
		const test = MOCK_TESTS.find((t) => t.id === id);
		const defaults: Record<string, number> = {};
		if (test) {
			for (const field of test.config) {
				defaults[field.key] = field.default;
			}
		}
		setConfigValues(defaults);
		setLogs([]);
	}

	function handleConfigChange(key: string, value: number) {
		setConfigValues((prev) => ({ ...prev, [key]: value }));
	}

	const handleRun = useCallback(() => {
		if (!selectedTestId) return;
		setIsRunning(true);
		setLogs([]);
		cancelRef.current = runMockTest(
			selectedTestId,
			(entry) => setLogs((prev) => [...prev, entry]),
			() => setIsRunning(false),
		);
	}, [selectedTestId]);

	function handleStop() {
		cancelRef.current?.();
		setIsRunning(false);
	}

	function handleClear() {
		setLogs([]);
	}

	return (
		<Grid h="100%" styles={{ inner: { height: "100%" } }}>
			<Grid.Col span={5}>
				<TestSelector
					tests={MOCK_TESTS}
					selectedId={selectedTestId}
					onSelect={handleSelect}
					isRunning={isRunning}
					onRun={handleRun}
					onStop={handleStop}
				/>
				<TestConfig
					test={selectedTest}
					values={configValues}
					onChange={handleConfigChange}
					disabled={isRunning}
				/>
			</Grid.Col>
			<Grid.Col span={7} style={{ display: "flex", flexDirection: "column" }}>
				<TestLog logs={logs} onClear={handleClear} />
			</Grid.Col>
		</Grid>
	);
}
