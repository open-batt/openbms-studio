import {
    Button,
    Checkbox,
    Divider,
    NumberInput,
    ScrollArea,
    Stack,
    Text,
} from "@mantine/core";
import type { ChartGroupDef } from "./series-config";

interface SeriesSidebarProps {
    groups: ChartGroupDef[];
    visibilityMap: Record<string, boolean>;
    onVisibilityChange: (id: string, visible: boolean) => void;
    windowSec: number;
    onWindowSecChange: (s: number) => void;
    onClear: () => void;
}

export function SeriesSidebar({
    groups,
    visibilityMap,
    onVisibilityChange,
    windowSec,
    onWindowSecChange,
    onClear,
}: SeriesSidebarProps) {
    return (
        <Stack w={220} gap="xs" style={{ flexShrink: 0 }}>
            <ScrollArea style={{ flex: 1 }}>
                <Stack gap="md" pr="xs">
                    {groups.map((group) => (
                        <Stack key={group.title} gap={4}>
                            <Text size="xs" fw={600} c="dimmed">
                                {group.title}
                            </Text>
                            {group.series.map((s) => (
                                <Checkbox
                                    key={s.id}
                                    label={s.label}
                                    checked={visibilityMap[s.id] !== false}
                                    onChange={(e) =>
                                        onVisibilityChange(
                                            s.id,
                                            e.currentTarget.checked,
                                        )
                                    }
                                    size="xs"
                                />
                            ))}
                        </Stack>
                    ))}
                </Stack>
            </ScrollArea>
            <Divider />
            <NumberInput
                label="Time range (s)"
                value={windowSec}
                onChange={(v) => typeof v === "number" && onWindowSecChange(v)}
                min={5}
                max={3600}
                size="xs"
            />
            <Button variant="outline" size="xs" onClick={onClear}>
                Clear Graphs
            </Button>
        </Stack>
    );
}
