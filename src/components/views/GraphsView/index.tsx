import { Box, Flex, Stack } from "@mantine/core";
import { useState } from "react";
import { useBmsHistory } from "@/hooks/useBmsHistory";
import { ChartPanel } from "./ChartPanel";
import { SeriesSidebar } from "./SeriesSidebar";
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
        <Flex h="100%" gap="md">
            <Stack flex={1} gap="xs" style={{ minWidth: 0 }} h="100%">
                {CHART_GROUPS.map((group) => (
                    <Box key={group.title} style={{ flex: 1, minHeight: 0 }}>
                        <ChartPanel
                            group={group}
                            history={history}
                            visibilityMap={visibility}
                        />
                    </Box>
                ))}
            </Stack>
            <SeriesSidebar
                groups={CHART_GROUPS}
                visibilityMap={visibility}
                onVisibilityChange={handleVisibilityChange}
                windowSec={windowSec}
                onWindowSecChange={setWindowSec}
                onClear={clear}
            />
        </Flex>
    );
}
