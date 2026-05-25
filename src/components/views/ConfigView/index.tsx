import { invoke } from "@tauri-apps/api/core";
import { notifications } from "@mantine/notifications";
import { open, save } from "@tauri-apps/plugin-dialog";
import { readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import {
	Button,
	Code,
	Grid,
	ScrollArea,
	Stack,
	Text,
	Title,
} from "@mantine/core";
import { useState } from "react";
import type { BmsConfig } from "@/bindings/BmsConfig";

export function ConfigView() {
	const [boardConfig, setBoardConfig] = useState<BmsConfig | null>(null);
	const [fileConfig, setFileConfig] = useState<BmsConfig | null>(null);
	const [reading, setReading] = useState(false);
	const [writing, setWriting] = useState(false);

	async function handleReadFromBoard() {
		setReading(true);
		try {
			const config = await invoke<BmsConfig>("read_config");
			setBoardConfig(config);
		} catch (e) {
			notifications.show({
				title: "Read failed",
				message: String(e),
				color: "red",
			});
		} finally {
			setReading(false);
		}
	}

	async function handleSaveToFile() {
		if (!boardConfig) return;
		const path = await save({
			filters: [{ name: "BMS Config", extensions: ["json"] }],
		});
		if (!path) return;
		try {
			await writeTextFile(path, JSON.stringify(boardConfig, null, 2));
			notifications.show({ title: "Saved", message: path, color: "green" });
		} catch (e) {
			notifications.show({
				title: "Save failed",
				message: String(e),
				color: "red",
			});
		}
	}

	async function handleLoadFromFile() {
		const path = await open({
			filters: [{ name: "BMS Config", extensions: ["json"] }],
		});
		if (!path) return;
		try {
			const raw = await readTextFile(path as string);
			setFileConfig(JSON.parse(raw) as BmsConfig);
		} catch (e) {
			notifications.show({
				title: "Load failed",
				message: String(e),
				color: "red",
			});
		}
	}

	async function handleWriteToBoard() {
		if (!fileConfig) return;
		setWriting(true);
		try {
			await invoke("write_config", { config: fileConfig });
			notifications.show({
				title: "Written",
				message: "Config applied to board",
				color: "green",
			});
		} catch (e) {
			notifications.show({
				title: "Write failed",
				message: String(e),
				color: "red",
			});
		} finally {
			setWriting(false);
		}
	}

	return (
		<Grid>
			<Grid.Col span={6}>
				<Stack>
					<Title order={4}>Board → File</Title>
					<Text size="sm" c="dimmed">
						Read all configuration registers from the connected board.
					</Text>
					<Button loading={reading} onClick={handleReadFromBoard}>
						Read from Board
					</Button>
					<ScrollArea h={400}>
						<Code block>
							{boardConfig
								? JSON.stringify(boardConfig, null, 2)
								: "No data — click 'Read from Board'"}
						</Code>
					</ScrollArea>
					<Button disabled={!boardConfig} onClick={handleSaveToFile}>
						Save to File
					</Button>
				</Stack>
			</Grid.Col>
			<Grid.Col span={6}>
				<Stack>
					<Title order={4}>File → Board</Title>
					<Text size="sm" c="dimmed">
						Load a previously saved config file and write it to the board.
					</Text>
					<Button onClick={handleLoadFromFile}>Load from File</Button>
					<ScrollArea h={400}>
						<Code block>
							{fileConfig
								? JSON.stringify(fileConfig, null, 2)
								: "No file loaded — click 'Load from File'"}
						</Code>
					</ScrollArea>
					<Button
						loading={writing}
						disabled={!fileConfig}
						onClick={handleWriteToBoard}
					>
						Write to Board
					</Button>
				</Stack>
			</Grid.Col>
		</Grid>
	);
}
