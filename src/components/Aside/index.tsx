import { Stack, Text, Flex } from '@mantine/core'
import { useBmsData } from "@/hooks/useBmsData"
import { formatMinutes } from "@/lib/format-time"
import { Gauge } from "@/components/Gauge"

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <Flex justify="space-between" align="baseline">
      <Text size="13px" c="dimmed">{label}</Text>
      <Text size="13px" c="white" style={{ fontVariantNumeric: 'tabular-nums' }}>{value}</Text>
    </Flex>
  )
}

export function Aside() {
  const { data } = useBmsData()

  return (
    <Stack h="100%" align="center" p="16px 12px" gap="8px">
      <Gauge
        value={data?.relative_soc ?? 0}
        unit="%"
        label="SoC"
      />
      <Stack w="100%" gap="6px" mt="8px">
        <StatRow
          label="Pack V"
          value={data ? `${(data.voltage_mv / 1000).toFixed(2)} V` : "—"}
        />
        <StatRow
          label="Current"
          value={data ? `${data.current_ma} mA` : "—"}
        />
        <StatRow
          label="TTE"
          value={data ? formatMinutes(data.run_time_to_empty) : "—"}
        />
      </Stack>
    </Stack>
  )
}
