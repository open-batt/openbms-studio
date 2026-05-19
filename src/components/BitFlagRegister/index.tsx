import { Button, Card, Center, Table, Text } from "@mantine/core";
import _ from "lodash";
import type { RegisterValue } from "@/bindings";
import classes from "@/components/BitFlagRegister/index.module.css";
import type { RegisterEntry } from "@/components/RegisterTable";
import { useRegisterSubscription } from "@/contexts/ActiveRegistersContext";
import {
    formatRegisterHex,
    REGISTER_ADDR,
    REGISTER_META,
} from "@/lib/display-meta";

const REGISTER_SIZE = 16;

interface Props {
    registers: RegisterEntry[];
}

function getBit(value: RegisterValue, bit: number): boolean {
    const word =
        "Word" in value
            ? value.Word
            : "SignedWord" in value
              ? value.SignedWord & 0xffff
              : 0;
    return Boolean((word >> bit) & 1);
}

export function BitFlagRegister({ registers }: Props) {
    const names = registers.map((r) => r.def.name);
    const values = useRegisterSubscription(names);

    return (
        <Card>
            <Card.Section bg="purple" px="lg" h="xl">
                <Text fw={700} size="lg">
                    Bit Flag Registers
                </Text>
            </Card.Section>
            <Table>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Register</Table.Th>
                        <Table.Th>Address</Table.Th>
                        <Table.Th>Hex</Table.Th>
                        {_(REGISTER_SIZE)
                            .times()
                            .map((_v, i) => (
                                <Table.Th key={`head-${i}`}>
                                    <Center>Bit {REGISTER_SIZE - i - 1}</Center>
                                </Table.Th>
                            ))}
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {registers.map(({ def }) => {
                        const value = values.get(def.name) ?? null;
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
                                {_(REGISTER_SIZE)
                                    .times()
                                    .map((_v, i) => {
                                        const bitIndex = REGISTER_SIZE - i - 1;
                                        const field = def.fields.find(
                                            (f) =>
                                                "Bit" in f.field_type &&
                                                f.field_type.Bit === bitIndex,
                                        );
                                        const isSet = value
                                            ? getBit(value, bitIndex)
                                            : false;
                                        return (
                                            <Table.Td
                                                key={`${def.name}-bit-${bitIndex}`}
                                            >
                                                <Center>
                                                    <Button
                                                        variant="outline"
                                                        color={
                                                            isSet
                                                                ? "green"
                                                                : "red"
                                                        }
                                                        w="5rem"
                                                        className={
                                                            classes.button
                                                        }
                                                        disabled={
                                                            !value || !field
                                                        }
                                                    >
                                                        <Text size="xs">
                                                            {field
                                                                ? field.name
                                                                : String(
                                                                      bitIndex,
                                                                  )}
                                                        </Text>
                                                    </Button>
                                                </Center>
                                            </Table.Td>
                                        );
                                    })}
                            </Table.Tr>
                        );
                    })}
                </Table.Tbody>
            </Table>
        </Card>
    );
}
