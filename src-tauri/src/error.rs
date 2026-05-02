use serde::Serialize;
use ts_rs::TS;

#[derive(Debug, Clone, Serialize, TS)]
#[ts(export)]
pub struct CommsError {
    pub code: String,
    pub message: String,
}

#[derive(Debug)]
pub enum BmsError {
    SerialPort(String),
    Timeout,
    CrcMismatch { expected: u16, got: u16 },
    ModbusException { function_code: u8, exception_code: u8 },
    InvalidResponse(String),
    NotConnected,
    UnknownRegister(String),
    UnknownField(String),
}

impl std::fmt::Display for BmsError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            BmsError::SerialPort(msg) => write!(f, "serial port error: {}", msg),
            BmsError::Timeout => write!(f, "response timeout"),
            BmsError::CrcMismatch { expected, got } => {
                write!(f, "CRC mismatch: expected 0x{:04X}, got 0x{:04X}", expected, got)
            }
            BmsError::ModbusException { function_code, exception_code } => {
                write!(f, "Modbus exception: FC=0x{:02X}, code=0x{:02X}", function_code, exception_code)
            }
            BmsError::InvalidResponse(msg) => write!(f, "invalid response: {}", msg),
            BmsError::NotConnected => write!(f, "not connected"),
            BmsError::UnknownRegister(name) => write!(f, "unknown register: {}", name),
            BmsError::UnknownField(name) => write!(f, "unknown field: {}", name),
        }
    }
}

impl Serialize for BmsError {
    fn serialize<S: serde::Serializer>(&self, s: S) -> Result<S::Ok, S::Error> {
        s.serialize_str(&self.to_string())
    }
}

impl From<BmsError> for CommsError {
    fn from(e: BmsError) -> Self {
        let code = match &e {
            BmsError::SerialPort(_) => "SerialPort",
            BmsError::Timeout => "Timeout",
            BmsError::CrcMismatch { .. } => "CrcMismatch",
            BmsError::ModbusException { .. } => "ModbusException",
            BmsError::InvalidResponse(_) => "InvalidResponse",
            BmsError::NotConnected => "NotConnected",
            BmsError::UnknownRegister(_) => "UnknownRegister",
            BmsError::UnknownField(_) => "UnknownField",
        }
        .to_string();
        CommsError {
            code,
            message: e.to_string(),
        }
    }
}