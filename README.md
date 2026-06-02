# OpenBMS Studio

Desktop application for monitoring and configuring OpenBMS boards over Modbus RTU via USB-serial.

Built with [Tauri v2](https://tauri.app) (Rust backend) + React 19 + TypeScript.

**Live demo:** https://open-batt.github.io/openbms-studio/

## Requirements

- [Node.js](https://nodejs.org) (via nvm recommended)
- [Rust toolchain](https://rustup.rs) (for the full desktop app)

## Development

```bash
# UI only (no Rust required)
npm run dev

# Full desktop app
npm run tauri dev
```

## Build

```bash
npm run tauri build
```

## License

[LICENSE](LICENSE)
