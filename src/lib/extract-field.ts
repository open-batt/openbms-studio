import type { FieldDef, FieldType, RegisterValue } from "../bindings"

export function extractField(
  value: RegisterValue,
  field: FieldDef
): number | number[] {
  const ft = field.field_type
  if ("Bit" in ft) {
    if (!("Word" in value) && !("SignedWord" in value)) throw new Error("Bit field requires Word value")
    const word = "Word" in value ? value.Word : value.SignedWord
    return (word >> ft.Bit) & 1
  }
  if ("BitRange" in ft) {
    if (!("Word" in value) && !("SignedWord" in value)) throw new Error("BitRange requires Word value")
    const word = "Word" in value ? value.Word : value.SignedWord
    const { high, low } = ft.BitRange
    const mask = (1 << (high - low + 1)) - 1
    return (word >> low) & mask
  }
  if ("ByteField" in ft) {
    if (!("Block" in value)) throw new Error("ByteField requires Block value")
    const { byte_offset, prim } = ft.ByteField
    return readPrimitive(value.Block, byte_offset, prim)
  }
  if ("PrimitiveArray" in ft) {
    if (!("Block" in value)) throw new Error("PrimitiveArray requires Block value")
    const { count, prim } = ft.PrimitiveArray
    const stride = primitiveStride(prim)
    return Array.from({ length: count }, (_, i) =>
      readPrimitive(value.Block, i * stride, prim)
    )
  }
  throw new Error(`Unknown field type: ${JSON.stringify(ft)}`)
}

export function applyField(
  current: number,
  ft: FieldType,
  fieldValue: number
): number {
  if ("Bit" in ft) {
    const mask = 1 << ft.Bit
    return fieldValue !== 0 ? (current | mask) : (current & ~mask)
  }
  if ("BitRange" in ft) {
    const { high, low } = ft.BitRange
    const mask = ((1 << (high - low + 1)) - 1) << low
    return (current & ~mask) | ((fieldValue << low) & mask)
  }
  throw new Error("applyField only supports Bit and BitRange on word values")
}

function primitiveStride(prim: string): number {
  switch (prim) {
    case "U8":  case "I8":  return 1
    case "U16": case "I16": return 2
    case "U32": case "I32": return 4
    default: throw new Error(`Unknown primitive type: ${prim}`)
  }
}

function readPrimitive(bytes: number[], offset: number, prim: string): number {
  switch (prim) {
    case "U8":  return bytes[offset]
    case "I8":  return (bytes[offset] << 24) >> 24
    case "U16": return (bytes[offset] << 8) | bytes[offset + 1]
    case "I16": return ((bytes[offset] << 8) | bytes[offset + 1]) << 16 >> 16
    case "U32": return ((bytes[offset] << 24) | (bytes[offset+1] << 16) | (bytes[offset+2] << 8) | bytes[offset+3]) >>> 0
    case "I32": return  (bytes[offset] << 24) | (bytes[offset+1] << 16) | (bytes[offset+2] << 8) | bytes[offset+3]
    default: throw new Error(`Unknown primitive type: ${prim}`)
  }
}