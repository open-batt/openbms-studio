import { Card, Table, Text } from "@mantine/core";
import {
    REGISTER_ADDR,
    REGISTER_META,
    formatRegisterHex,
} from "@/lib/display-meta";
import type { RegisterDef, RegisterValue } from "@/bindings";

export interface RegisterEntry {
    def: RegisterDef;
    value: RegisterValue | null;
}

interface Props {
    title: string;
    registers: RegisterEntry[];
}

function formatValue(value: RegisterValue, unit?: string): string {
    if ("Word" in value)
        return unit ? `${value.Word} ${unit}` : `${value.Word}`;
    if ("SignedWord" in value)
        return unit ? `${value.SignedWord} ${unit}` : `${value.SignedWord}`;
    return `[Block]`;
}

export function ValueRegister({ title, registers }: Props) {
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
                        <Table.Th>Hex</Table.Th>
                        <Table.Th>Unit</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {registers.map(({ def, value }) => {
                        const meta = REGISTER_META[def.name];
                        const addr = REGISTER_ADDR[def.name];
                        return (
                            <Table.Tr key={def.name}>
                                <Table.Td>{meta?.label ?? def.name}</Table.Td>
                                <Table.Td>
                                    {addr !== undefined
                                        ? `0x${addr.toString(16).toUpperCase().padStart(2, "0")}`
                                        : "—"}
                                </Table.Td>
                                <Table.Td>
                                    {value ? formatRegisterHex(value) : "—"}
                                </Table.Td>
                                <Table.Td>
                                    {value
                                        ? formatValue(value, meta?.unit)
                                        : "—"}
                                </Table.Td>
                            </Table.Tr>
                        );
                    })}
                </Table.Tbody>
            </Table>
        </Card>
    );
}
