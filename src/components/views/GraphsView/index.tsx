import {
    Button,
    Checkbox,
    Flex,
    Group,
    NumberInput,
    Paper,
    ScrollArea,
    Stack,
    Text,
} from "@mantine/core";
import { useState } from "react";
import { useBmsHistory } from "@/hooks/useBmsHistory";
import { ChartPanel } from "./ChartPanel";
import { CHART_GROUPS, defaultVisibilityMap } from "./series-config";

export function GraphsView() {
    const [windowSec, setWindowSec] = useState(60);
    const [visibility, setVisibility] =
        useState<Record<string, boolean>>(defaultVisibilityMap);
    const { history, clear } = useBmsHistory(windowSec * 1000);

    function handleVisibilityChange(id: string, visible: boolean) {
        setVisibility((prev) => ({ ...prev, [id]: visible }));
    }

    return (
        <Stack h="100%" gap="xs">
            <Group justify="flex-end" gap="sm" align="flex-end">
                <NumberInput
                    label="Time range (s)"
                    value={windowSec}
                    onChange={(v) => typeof v === "number" && setWindowSec(v)}
                    min={5}
                    max={3600}
                    size="xs"
                    w={130}
                />
                <Button variant="outline" size="xs" onClick={clear}>
                    Clear Graphs
                </Button>
            </Group>
            <ScrollArea flex={1} offsetScrollbars>
                <Stack gap="xs">
                    {CHART_GROUPS.map((group) => (
                        <Flex key={group.title} gap="xs" align="stretch">
                            <Paper flex={1} withBorder h={300} p={0}>
                                <ChartPanel
                                    group={group}
                                    history={history}
                                    visibilityMap={visibility}
                                    windowSec={windowSec}
                                />
                            </Paper>
                            <Stack
                                w={180}
                                gap="xs"
                                p="xs"
                                style={{ flexShrink: 0 }}
                            >
                                <Text size="xs" fw={600} c="dimmed">
                                    {group.title}
                                </Text>
                                {group.series.map((s) => (
                                    <Checkbox
                                        key={s.id}
                                        label={s.label}
                                        checked={visibility[s.id] !== false}
                                        onChange={(e) =>
                                            handleVisibilityChange(
                                                s.id,
                                                e.currentTarget.checked,
                                            )
                                        }
                                        size="xs"
                                    />
                                ))}
                            </Stack>
                        </Flex>
                    ))}
                </Stack>
            </ScrollArea>
        </Stack>
    );
}
