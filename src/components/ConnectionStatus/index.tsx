import { Group, Text } from "@mantine/core";
import { Led } from "@/components/Led";

export function ConnectionStatus() {
	return (
		<Group gap="xs" align="center">
			<Led color="green" />
			<Text size="xs" c="green">
				Connected
			</Text>
		</Group>
	);
}