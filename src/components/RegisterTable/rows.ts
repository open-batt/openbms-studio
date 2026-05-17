import { REGISTER_ADDR, REGISTER_META } from "@/lib/display-meta";
import { extractField } from "@/lib/extract-field";
import type { RegisterEntry, RegisterRow } from "./index";

const CELL_INDICES = [0, 1, 2, 3, 4, 5, 6];

export function scalarRows(registers: RegisterEntry[]): RegisterRow[] {
    return registers.map(({ def, value }) => {
        const meta = REGISTER_META[def.name];
        const addr = REGISTER_ADDR[def.name];

        let numericValue: number | null = null;
        if (value) {
            if ("Word" in value) {
                numericValue = value.Word;
            } else if ("SignedWord" in value) {
                numericValue = value.SignedWord;
            }
        }

        return {
            label: meta?.label ?? def.name,
            address:
                addr !== undefined
                    ? `0x${addr.toString(16).toUpperCase().padStart(2, "0")}`
                    : undefined,
            value: numericValue,
            unit: meta?.unit,
        };
    });
}

export function cellRows(entry: RegisterEntry | undefined): RegisterRow[] {
    const meta = entry ? REGISTER_META[entry.def.name] : undefined;
    const addr = entry ? REGISTER_ADDR[entry.def.name] : undefined;
    const addressStr =
        addr !== undefined
            ? `0x${addr.toString(16).toUpperCase().padStart(2, "0")}`
            : undefined;

    const field = entry?.def.fields[0];
    let cellValues: (number | null)[] = CELL_INDICES.map(() => null);

    if (entry?.value && field && "PrimitiveArray" in field.field_type) {
        try {
            const values = extractField(entry.value, field) as number[];
            cellValues = CELL_INDICES.map((i) => values[i] ?? null);
        } catch {
            // keep nulls on decode error
        }
    }

    return CELL_INDICES.map((i) => ({
        label: `Cell ${i + 1}`,
        address: addressStr,
        value: cellValues[i],
        unit: meta?.unit,
    }));
}
