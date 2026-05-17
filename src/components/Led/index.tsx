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
                flexShrink: 0,
            }}
        />
    );
}
