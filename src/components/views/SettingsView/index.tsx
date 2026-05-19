import { Slider, Stack, Text } from "@mantine/core";
import { invoke } from "@tauri-apps/api/core";
import { useSettings } from "@/contexts/SettingsContext";

const MARKS = Array.from({ length: 10 }, (_, i) => ({
    value: (i + 1) * 1000,
    label: `${i + 1}s`,
}));

export function SettingsView() {
    const { settings, setRefreshIntervalMs } = useSettings();

    function handleChange(ms: number) {
        setRefreshIntervalMs(ms);
        invoke("set_polling_interval", { intervalMs: ms }).catch(console.error);
    }

    return (
        <Stack p="xl" maw={520}>
            <Text fw={700} size="xl">
                Settings
            </Text>
            <div>
                <Text mb="xs" size="sm" c="dimmed">
                    Register refresh interval
                </Text>
                <Text fw={500} mb="lg">
                    {settings.refreshIntervalMs / 1000}s
                </Text>
                <Slider
                    min={1000}
                    max={10000}
                    step={1000}
                    value={settings.refreshIntervalMs}
                    onChange={handleChange}
                    marks={MARKS}
                    label={null}
                    mb="xl"
                />
            </div>
        </Stack>
    );
}
