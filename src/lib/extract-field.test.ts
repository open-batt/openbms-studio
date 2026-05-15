import { describe, it, expect } from "vitest";
import { extractField, applyField } from "./extract-field";
import type { FieldDef, RegisterValue } from "../bindings";

describe("extractField", () => {
    it("extracts bit 15 when set", () => {
        const value: RegisterValue = { Word: 0x8000 };
        const field: FieldDef = {
            name: "OVER_CHARGED_ALARM",
            access: "Read",
            field_type: { Bit: 15 },
        };
        expect(extractField(value, field)).toBe(1);
    });

    it("extracts bit 15 when clear", () => {
        const value: RegisterValue = { Word: 0x0000 };
        const field: FieldDef = {
            name: "OVER_CHARGED_ALARM",
            access: "Read",
            field_type: { Bit: 15 },
        };
        expect(extractField(value, field)).toBe(0);
    });

    it("extracts bit range ERROR_CODE (bits 3–0)", () => {
        const value: RegisterValue = { Word: 0x000f };
        const field: FieldDef = {
            name: "ERROR_CODE",
            access: "Read",
            field_type: { BitRange: { high: 3, low: 0 } },
        };
        expect(extractField(value, field)).toBe(0xf);
    });

    it("extracts partial bit range", () => {
        const value: RegisterValue = { Word: 0x00a0 };
        const field: FieldDef = {
            name: "test",
            access: "Read",
            field_type: { BitRange: { high: 7, low: 5 } },
        };
        expect(extractField(value, field)).toBe(5);
    });

    it("extracts U16 ByteField from block", () => {
        const bytes = new Uint8Array([0x0f, 0xa0, 0x0f, 0xa2]);
        const value: RegisterValue = { Block: Array.from(bytes) };
        const field: FieldDef = {
            name: "cell1",
            access: "Read",
            field_type: { ByteField: { byte_offset: 0, prim: "U16" } },
        };
        expect(extractField(value, field)).toBe(0x0fa0);
    });

    it("extracts U16 ByteField at offset 2", () => {
        const bytes = new Uint8Array([0x0f, 0xa0, 0x0f, 0xa2]);
        const value: RegisterValue = { Block: Array.from(bytes) };
        const field: FieldDef = {
            name: "cell2",
            access: "Read",
            field_type: { ByteField: { byte_offset: 2, prim: "U16" } },
        };
        expect(extractField(value, field)).toBe(0x0fa2);
    });

    it("extracts PrimitiveArray of U16", () => {
        const bytes = new Uint8Array([0x0f, 0xa0, 0x0f, 0xa2, 0x0f, 0x9e]);
        const value: RegisterValue = { Block: Array.from(bytes) };
        const field: FieldDef = {
            name: "cells",
            access: "Read",
            field_type: { PrimitiveArray: { count: 3, prim: "U16" } },
        };
        expect(extractField(value, field)).toEqual([4000, 4002, 3998]);
    });
});

describe("applyField", () => {
    it("sets bit 0 in a word", () => {
        expect(applyField(0x0000, { Bit: 0 }, 1)).toBe(0x0001);
    });

    it("clears bit 1 in a word", () => {
        expect(applyField(0x0003, { Bit: 1 }, 0)).toBe(0x0001);
    });

    it("applies BitRange", () => {
        expect(applyField(0x0000, { BitRange: { high: 3, low: 0 } }, 7)).toBe(
            0x0007,
        );
    });
});
