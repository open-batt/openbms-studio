import { Card, Table, Text } from "@mantine/core";
import type { RegisterDef, RegisterValue } from "@/bindings";

export interface RegisterEntry {
    def: RegisterDef;
    value: RegisterValue | null;
}

export interface RegisterRow {
    label: string;
    address?: string;
    value: number | null;
    unit?: string;
}

interface Props {
    title: string;
    rows: RegisterRow[];
}

export function RegisterTable({ title, rows }: Props) {
    return (
        <Card>
            <Card.Section bg="purple" px="lg" h="xl">
                <Text fw={700} size="lg">
                    {title}
                </Text>
            </Card.Section>
            <Table>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th w="20rem">Name</Table.Th>
                        <Table.Th>Address</Table.Th>
                        <Table.Th>Value</Table.Th>
                        <Table.Th>Unit</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {rows.map((row, i) => (
                        <Table.Tr key={i}>
                            <Table.Td>{row.label}</Table.Td>
                            <Table.Td>{row.address ?? "—"}</Table.Td>
                            <Table.Td>
                                {row.value !== null ? String(row.value) : "—"}
                            </Table.Td>
                            <Table.Td>{row.unit ?? "—"}</Table.Td>
                        </Table.Tr>
                    ))}
                </Table.Tbody>
            </Table>
        </Card>
    );
}
