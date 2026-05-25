import { Badge, Box, Button, Group, ScrollArea, Stack, Text, Title } from "@mantine/core";
import { useEffect, useRef } from "react";
import type { LogEntry, LogSeverity } from "./types";

const BADGE_COLOR: Record<LogSeverity, string> = {
	info: "blue",
	warn: "yellow",
	error: "red",
};

function formatTimestamp(d: Date): string {
	const hh = String(d.getUTCHours()).padStart(2, "0");
	const mm = String(d.getUTCMinutes()).padStart(2, "0");
	const ss = String(d.getUTCSeconds()).padStart(2, "0");
	const ms = String(d.getUTCMilliseconds()).padStart(3, "0");
	return `${hh}:${mm}:${ss}.${ms}`;
}

interface TestLogProps {
	logs: LogEntry[];
	onClear: () => void;
}

export function TestLog({ logs, onClear }: TestLogProps) {
	const viewport = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (viewport.current) {
			viewport.current.scrollTo?.({ top: viewport.current.scrollHeight, behavior: "smooth" });
		}
	}, [logs]);

	return (
		<Stack h="100%" gap="xs">
			<Group justify="space-between">
				<Title order={5}>Test Logs</Title>
				<Button size="xs" variant="subtle" color="gray" onClick={onClear} disabled={logs.length === 0}>
					Clear
				</Button>
			</Group>

			<ScrollArea flex={1} viewportRef={viewport} styles={{ viewport: { fontFamily: "monospace" } }}>
				{logs.length === 0 ? (
					<Text c="dimmed" size="sm" ta="center" mt="xl">
						No logs yet — select a test and press Run
					</Text>
				) : (
					logs.map((entry, i) => (
						<Box
							key={entry.id}
							px="xs"
							py={4}
							bg={i % 2 === 0 ? "dark.7" : "dark.6"}
						>
							<Group gap="xs" wrap="nowrap">
								<Text size="xs" c="dimmed" ff="monospace" style={{ flexShrink: 0 }}>
									{formatTimestamp(entry.timestamp)}
								</Text>
								<Badge size="xs" color={BADGE_COLOR[entry.severity]} style={{ flexShrink: 0 }}>
									{entry.severity}
								</Badge>
								<Text size="sm">{entry.message}</Text>
							</Group>
						</Box>
					))
				)}
			</ScrollArea>
		</Stack>
	);
}
