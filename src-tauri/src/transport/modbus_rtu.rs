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
}