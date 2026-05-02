use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Debug, Clone, Serialize, Deserialize, TS)]
#[ts(export)]
pub enum Access {
    Read,
    Write,
    ReadWrite,
}

#[derive(Debug, Clone, Serialize, Deserialize, TS)]
#[ts(export)]
pub enum ValueType {
    Word,
    SignedWord,
    Block(u32),
}

#[derive(Debug, Clone, Serialize, Deserialize, TS)]
#[ts(export)]
pub enum PrimitiveType {
    U8,
    U16,
    U32,
    I8,
    I16,
    I32,
}

#[derive(Debug, Clone, Serialize, TS)]
#[ts(export)]
pub enum FieldType {
    Bit(u8),
    BitRange { high: u8, low: u8 },
    ByteField { byte_offset: u32, prim: PrimitiveType },
    PrimitiveArray { count: u32, prim: PrimitiveType },
}

#[derive(Debug, Clone, Serialize, TS)]
#[ts(export)]
pub struct FieldDef {
    pub name: String,
    pub access: Access,
    pub field_type: FieldType,
}

#[derive(Debug, Clone, Serialize, TS)]
#[ts(export)]
pub struct RegisterDef {
    pub name: String,
    pub access: Access,
    pub value_type: ValueType,
    pub fields: Vec<FieldDef>,
}

#[derive(Debug, Clone, Serialize, Deserialize, TS)]
#[ts(export)]
pub enum RegisterValue {
    Word(u16),
    SignedWord(i16),
    Block(Vec<u8>),
}