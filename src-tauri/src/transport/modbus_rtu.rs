use std::io::{Read, Write};
use std::time::Duration;
use std::sync::Mutex;
use serialport::SerialPort;
use crate::error::BmsError;
use super::BmsTransport;

const DEVICE_ADDRESS: u8 = 0x01;
const RESPONSE_TIMEOUT_MS: u64 = 500;

pub struct ModbusRtu {
    port: Mutex<Box<dyn SerialPort>>,
}

impl ModbusRtu {
    pub fn new(port_name: &str, baud_rate: u32) -> Result<Self, BmsError> {
        let port = serialport::new(port_name, baud_rate)
            .timeout(Duration::from_millis(RESPONSE_TIMEOUT_MS))
            .open()
            .map_err(|e| BmsError::SerialPort(e.to_string()))?;
        Ok(Self { port: Mutex::new(port) })
    }

    fn send_and_receive(&mut self, request: &[u8], expected_response_len: usize) -> Result<Vec<u8>, BmsError> {
        let mut port = self.port.lock().map_err(|_| BmsError::SerialPort("mutex poisoned".into()))?;
        port.write_all(request).map_err(|e| BmsError::SerialPort(e.to_string()))?;
        port.flush().map_err(|e| BmsError::SerialPort(e.to_string()))?;

        let mut response = vec![0u8; expected_response_len];
        port.read_exact(&mut response).map_err(|e| {
            if e.kind() == std::io::ErrorKind::TimedOut {
                BmsError::Timeout
            } else {
                BmsError::SerialPort(e.to_string())
            }
        })?;
        Ok(response)
    }
}

impl BmsTransport for ModbusRtu {
    fn read_word(&mut self, address: u8) -> Result<u16, BmsError> {
        let request = build_read_request(DEVICE_ADDRESS, address, 1);
        // response: addr(1) + fc(1) + byte_count(1) + data(2) + crc(2) = 7
        let response = self.send_and_receive(&request, 7)?;
        let data = parse_read_response(DEVICE_ADDRESS, &response)?;
        if data.len() < 2 {
            return Err(BmsError::InvalidResponse("word response too short".into()));
        }
        Ok(u16::from_be_bytes([data[0], data[1]]))
    }

    fn write_word(&mut self, address: u8, value: u16) -> Result<(), BmsError> {
        let request = build_write_word_request(DEVICE_ADDRESS, address, value);
        let response = self.send_and_receive(&request, 8)?;
        parse_write_echo(DEVICE_ADDRESS, 0x06, address, &response)
    }

    fn read_block(&mut self, address: u8, num_registers: u16) -> Result<Vec<u8>, BmsError> {
        let request = build_read_request(DEVICE_ADDRESS, address, num_registers);
        // response: addr(1) + fc(1) + byte_count(1) + data(num_registers*2) + crc(2)
        let expected_len = 5 + (num_registers as usize * 2);
        let response = self.send_and_receive(&request, expected_len)?;
        parse_read_response(DEVICE_ADDRESS, &response)
    }

    fn write_block(&mut self, address: u8, data: &[u8]) -> Result<(), BmsError> {
        let request = build_write_multiple_request(DEVICE_ADDRESS, address, data);
        // echo: addr(1) + fc(1) + addr_hi(1) + addr_lo(1) + qty_hi(1) + qty_lo(1) + crc(2) = 8
        let response = self.send_and_receive(&request, 8)?;
        parse_write_echo(DEVICE_ADDRESS, 0x10, address, &response)
    }
}

pub(crate) fn crc16(data: &[u8]) -> u16 {
    let mut crc: u16 = 0xFFFF;
    for &byte in data {
        crc ^= byte as u16;
        for _ in 0..8 {
            if crc & 0x0001 != 0 {
                crc = (crc >> 1) ^ 0xA001;
            } else {
                crc >>= 1;
            }
        }
    }
    crc
}

pub(crate) fn build_read_request(device: u8, address: u8, num_registers: u16) -> Vec<u8> {
    let mut frame = vec![
        device,
        0x03,
        0x00,
        address,
        (num_registers >> 8) as u8,
        (num_registers & 0xFF) as u8,
    ];
    let crc = crc16(&frame);
    frame.push((crc & 0xFF) as u8);
    frame.push((crc >> 8) as u8);
    frame
}

pub(crate) fn build_write_word_request(device: u8, address: u8, value: u16) -> Vec<u8> {
    let mut frame = vec![
        device,
        0x06,
        0x00,
        address,
        (value >> 8) as u8,
        (value & 0xFF) as u8,
    ];
    let crc = crc16(&frame);
    frame.push((crc & 0xFF) as u8);
    frame.push((crc >> 8) as u8);
    frame
}

pub(crate) fn build_write_multiple_request(device: u8, address: u8, data: &[u8]) -> Vec<u8> {
    let num_registers = (data.len() as u16 + 1) / 2;
    let mut frame = vec![
        device,
        0x10,
        0x00,
        address,
        (num_registers >> 8) as u8,
        (num_registers & 0xFF) as u8,
        data.len() as u8,
    ];
    frame.extend_from_slice(data);
    let crc = crc16(&frame);
    frame.push((crc & 0xFF) as u8);
    frame.push((crc >> 8) as u8);
    frame
}

pub(crate) fn parse_read_response(device: u8, frame: &[u8]) -> Result<Vec<u8>, crate::error::BmsError> {
    use crate::error::BmsError;

    if frame.len() < 5 {
        return Err(BmsError::InvalidResponse("frame too short".into()));
    }
    if frame[0] != device {
        return Err(BmsError::InvalidResponse("device address mismatch".into()));
    }

    let payload = &frame[..frame.len() - 2];
    let expected_crc = crc16(payload);
    let got_crc = (frame[frame.len() - 1] as u16) << 8 | frame[frame.len() - 2] as u16;
    if expected_crc != got_crc {
        return Err(BmsError::CrcMismatch { expected: expected_crc, got: got_crc });
    }

    if frame[1] & 0x80 != 0 {
        let original_fc = frame[1] & 0x7F;
        let exception_code = frame[2];
        return Err(BmsError::ModbusException { function_code: original_fc, exception_code });
    }

    let byte_count = frame[2] as usize;
    Ok(frame[3..3 + byte_count].to_vec())
}

pub(crate) fn parse_write_echo(
    device: u8,
    expected_fc: u8,
    expected_addr: u8,
    frame: &[u8],
) -> Result<(), crate::error::BmsError> {
    use crate::error::BmsError;

    if frame.len() < 8 {
        return Err(BmsError::InvalidResponse("write echo too short".into()));
    }
    if frame[0] != device {
        return Err(BmsError::InvalidResponse("device address mismatch".into()));
    }
    if frame[1] != expected_fc {
        return Err(BmsError::InvalidResponse("function code mismatch".into()));
    }
    if frame[3] != expected_addr {
        return Err(BmsError::InvalidResponse("register address mismatch".into()));
    }
    let payload = &frame[..frame.len() - 2];
    let expected_crc = crc16(payload);
    let got_crc = (frame[frame.len() - 1] as u16) << 8 | frame[frame.len() - 2] as u16;
    if expected_crc != got_crc {
        return Err(BmsError::CrcMismatch { expected: expected_crc, got: got_crc });
    }
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn crc16_read_cell_voltages_request() {
        // Protocol: request = 01 03 00 48 00 07 84 1E
        // CRC covers bytes 0..5, result is [0x84, 0x1E] (low byte first)
        let data = [0x01u8, 0x03, 0x00, 0x48, 0x00, 0x07];
        assert_eq!(crc16(&data), 0x1E84);
    }

    #[test]
    fn crc16_write_fet_state_request() {
        // Protocol: request = 01 06 00 42 00 01 E8 1E
        // CRC covers bytes 0..5, result is [0xE8, 0x1E] (low byte first)
        let data = [0x01u8, 0x06, 0x00, 0x42, 0x00, 0x01];
        assert_eq!(crc16(&data), 0x1EE8);
    }

    #[test]
    fn build_read_request_cell_voltages() {
        // FC 0x03: Read 7 registers starting at 0x48 from device 0x01
        // Expected frame (CRC appended low byte first): 01 03 00 48 00 07 <CRC_LO> <CRC_HI>
        let frame = build_read_request(0x01, 0x48, 7);
        assert_eq!(&frame[..6], &[0x01, 0x03, 0x00, 0x48, 0x00, 0x07]);
        assert_eq!(frame.len(), 8);
        // Verify CRC covers bytes 0..5
        let expected_crc = crc16(&frame[..6]);
        let got_crc = (frame[7] as u16) << 8 | frame[6] as u16;
        assert_eq!(got_crc, expected_crc);
    }

    #[test]
    fn build_write_word_request_fet_state() {
        // FC 0x06: Write 0x0001 to register 0x42 on device 0x01
        let frame = build_write_word_request(0x01, 0x42, 0x0001);
        assert_eq!(&frame[..6], &[0x01, 0x06, 0x00, 0x42, 0x00, 0x01]);
        assert_eq!(frame.len(), 8);
        let expected_crc = crc16(&frame[..6]);
        let got_crc = (frame[7] as u16) << 8 | frame[6] as u16;
        assert_eq!(got_crc, expected_crc);
    }

    #[test]
    fn build_write_multiple_request_one_register() {
        // FC 0x10: Write [0x00, 0x0A] (1 register = 10) to 0x04 (AtRate) on device 0x01
        let frame = build_write_multiple_request(0x01, 0x04, &[0x00, 0x0A]);
        // Header: 01 10 00 04 00 01 02 00 0A
        assert_eq!(&frame[..9], &[0x01, 0x10, 0x00, 0x04, 0x00, 0x01, 0x02, 0x00, 0x0A]);
        assert_eq!(frame.len(), 11);
        let expected_crc = crc16(&frame[..9]);
        let got_crc = (frame[10] as u16) << 8 | frame[9] as u16;
        assert_eq!(got_crc, expected_crc);
    }

    #[test]
    fn parse_read_response_cell_voltages() {
        // Build a valid read response for 7 cell voltages (14 bytes payload)
        let mut response = vec![
            0x01u8, 0x03, 0x0E,
            0x0F, 0xA0, // cell 1: 4000 mV
            0x0F, 0xA2, // cell 2: 4002 mV
            0x0F, 0x9E, // cell 3: 3998 mV
            0x0F, 0xA1, // cell 4: 4001 mV
            0x0F, 0x9F, // cell 5: 3999 mV
            0x0F, 0xA0, // cell 6: 4000 mV
            0x0F, 0xA3, // cell 7: 4003 mV
        ];
        let crc = crc16(&response);
        response.push((crc & 0xFF) as u8);
        response.push((crc >> 8) as u8);

        let data = parse_read_response(0x01, &response).unwrap();
        assert_eq!(data.len(), 14);
        assert_eq!(u16::from_be_bytes([data[0], data[1]]), 4000);
        assert_eq!(u16::from_be_bytes([data[2], data[3]]), 4002);
    }

    #[test]
    fn parse_read_response_crc_mismatch() {
        let frame = vec![0x01u8, 0x03, 0x02, 0x0F, 0xA0, 0xFF, 0xFF]; // bad CRC
        let result = parse_read_response(0x01, &frame);
        assert!(matches!(result, Err(crate::error::BmsError::CrcMismatch { .. })));
    }

    #[test]
    fn parse_read_response_modbus_exception() {
        // Error response: FC|0x80=0x83, exception code 0x02
        let mut response = vec![0x01u8, 0x83, 0x02];
        let crc = crc16(&response);
        response.push((crc & 0xFF) as u8);
        response.push((crc >> 8) as u8);

        let result = parse_read_response(0x01, &response);
        assert!(matches!(
            result,
            Err(crate::error::BmsError::ModbusException { function_code: 0x03, exception_code: 0x02 })
        ));
    }

    #[test]
    fn parse_write_echo_valid() {
        let request = build_write_word_request(0x01, 0x42, 0x0001);
        assert!(parse_write_echo(0x01, 0x06, 0x42, &request).is_ok());
    }
}