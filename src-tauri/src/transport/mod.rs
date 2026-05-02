pub mod modbus_rtu;

use crate::error::BmsError;

pub trait BmsTransport: Send + Sync {
    fn read_word(&mut self, address: u8) -> Result<u16, BmsError>;
    fn write_word(&mut self, address: u8, value: u16) -> Result<(), BmsError>;
    fn read_block(&mut self, address: u8, num_registers: u16) -> Result<Vec<u8>, BmsError>;
    fn write_block(&mut self, address: u8, data: &[u8]) -> Result<(), BmsError>;
}