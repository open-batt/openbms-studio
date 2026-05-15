import { Box } from "@mantine/core";

export function Led({
    color = "green",
    size = 8,
}: {
    color?: string;
    size?: number;
}) {
    return (
        <Box
            style={{
                width: size,
                height: size,
                borderRadius: "50%",
                backgroundColor: `var(--mantine-color-${color}-6)`,
                boxShadow: `0 0 6px 1px var(--mantine-color-${color}-4)`,
                flexShrink: 0,
            }}
        />
    );
}
