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
}