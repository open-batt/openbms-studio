import { Card, Table, Text } from "@mantine/core";
import { useMemo } from "react";
import type { RegisterDef, RegisterValue } from "@/bindings";
import { useRegisterSubscription } from "@/contexts/ActiveRegistersContext";
import { cellRows, scalarRows } from "./rows";

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
    entries: RegisterEntry[];
}

function isCellEntry(entry: RegisterEntry): boolean {
    return (
        entry.def.fields.length > 0 &&
        "PrimitiveArray" in entry.def.fields[0].field_type
    );
}

export function RegisterTable({ title, entries }: Props) {
    const names = useMemo(() => entries.map((e) => e.def.name), [entries]);
    const values = useRegisterSubscription(names);

    const enriched: RegisterEntry[] = entries.map((e) => ({
        ...e,
        value: values.get(e.def.name) ?? null,
    }));

    const rows =
        enriched.length === 1 && isCellEntry(enriched[0])
            ? cellRows(enriched[0])
            : scalarRows(enriched);

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
