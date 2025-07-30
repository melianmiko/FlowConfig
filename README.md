<div align="center">
<img src="assets/base/icon.png" alt="" />
<h1>FlowConfig</h1>
<p>A simple app that can change the language of Zepp Flow to any language you want (including unsupported ones).</p>
</div>

## 💽 Installation, usage

1. Pair your smartwatch with Amazfit / Zepp account, which
has access to Zepp Flow;
2. Install Zepp Flow from application store, and launch it at least once
to create configuration file;
3. Install FlowConfig from developer mode using QR-code bellow 
([how?](https://docs.zepp.com/docs/guides/tools/zepp-app/)):

<div align="center">
<img src="docs/install_qr.png" alt="" />
</div>

4. Launch ZeppConfig, choose language you want and **reboot your smartwatch**
to apply changes.

## ⚒️ Build from sources
NodeJS required

```bash
# Install toolchain
npm i -g zeusx @zeppos/zeus-cli @zeppos/zpm

# Prepare sources
git clone https://github.com/melianmiko/FlowConfig.git
cd FlowConfig
npm i

# Build and get preview QR code
zeusx preview

# ...or use any other zeusx build-install mode
```

## License

MIT.
