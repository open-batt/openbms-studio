import { Button, Divider, Flex, SimpleGrid, Stack, Text } from "@mantine/core";
import { Gauge } from "@/components/Gauge";
import { Led } from "@/components/Led";
import { useBmsData } from "@/hooks/useBmsData";
import { formatTemperature } from "@/lib/format-temperature";
import { formatMinutes } from "@/lib/format-time";

const PROTECTION_FLAGS = [
    { label: "OVP", bit: 15 },
    { label: "UVP", bit: 11 },
    { label: "OCP", bit: 14 },
    { label: "FAST", bit: 13 },
    { label: "OTP", bit: 12 },
    { label: "UTP", bit: 9 },
] as const;

const QUICK_COMMANDS = [
    "GAUGE_EN",
    "FET_EN",
    "CHG_FET",
    "DSG_FET",
    "LT_RESET",
    "SHUTDOWN",
] as const;

function StatRow({ label, value }: { label: string; value: string }) {
    return (
        <Flex justify="space-between" align="baseline">
            <Text size="sm" c="dimmed">
                {label}
            </Text>
            <Text
                size="sm"
                c="white"
                style={{ fontVariantNumeric: "tabular-nums" }}
            >
                {value}
            </Text>
        </Flex>
    );
}

function SectionLabel({ children }: { children: string }) {
    return (
        <Text
            size="xs"
            c="dimmed"
            tt="uppercase"
            fw={600}
            style={{ letterSpacing: "0.08em" }}
        >
            {children}
        </Text>
    );
}

function ProtectionFlag({ label, fault }: { label: string; fault: boolean }) {
    return (
        <Flex gap={5} align="center">
            <Led color={fault ? "red" : "green"} size={10} />
            <Text size="sm" c={fault ? "red.4" : "dimmed"}>
                {label}
            </Text>
        </Flex>
    );
}

export function Aside() {
    const { data } = useBmsData();

    return (
        <Stack h="100%" align="center" p="sm" gap="lg">
            <Gauge value={data?.relative_soc ?? 0} unit="%" label="SoC" />

            <Stack w="100%" gap="xs" mt={8}>
                <StatRow
                    label="Pack V"
                    value={
                        data ? `${(data.voltage_mv / 1000).toFixed(2)} V` : "—"
                    }
                />
                <StatRow
                    label="Current"
                    value={data ? `${data.current_ma} mA` : "—"}
                />
                <StatRow
                    label="Temp"
                    value={data ? formatTemperature(data.temperature_dk) : "—"}
                />
                <StatRow
                    label="TTE"
                    value={data ? formatMinutes(data.run_time_to_empty) : "—"}
                />
            </Stack>

            <Divider w="100%" />

            <Stack w="100%" gap="sm">
                <SectionLabel>Protection</SectionLabel>
                <SimpleGrid cols={2} spacing={6}>
                    {PROTECTION_FLAGS.map(({ label, bit }) => (
                        <ProtectionFlag
                            key={label}
                            label={label}
                            // battery_status is a u16 — only bits 0–15 are meaningful
                            fault={
                                data
                                    ? (data.battery_status & (1 << bit)) !== 0
                                    : false
                            }
                        />
                    ))}
                </SimpleGrid>
            </Stack>

            <Divider w="100%" />

            <Stack w="100%" gap="sm">
                <SectionLabel>Quick Commands</SectionLabel>
                {QUICK_COMMANDS.map((cmd) => (
                    <Button
                        key={cmd}
                        variant="default"
                        size="xs"
                        fullWidth
                        onClick={() => {
                            /* TODO: invoke Tauri command */
                        }}
                    >
                        {cmd}
                    </Button>
                ))}
            </Stack>
        </Stack>
    );
}
