<p align="center">
  <img src="./frontend/logo.svg" alt="VeriCampaign Logo" width="120">
</p>
<h1 align="center">VeriCampaign | Intelligent Escrow</h1>
<p align="center">
  <strong>Autonomous Web3 marketing escrow dApp powered by GenLayer & GenVM.</strong><br>
  Enforces strict source-policy URL controls and uses comparative AI consensus to audit promotional deliverables against brand guidelines.
</p>
<p align="center">
  <a href="https://dorinalunar.github.io/vericampaign-escrow-dapp/frontend/">
    <img src="https://img.shields.io/badge/Live_Demo-GitHub_Pages-success?style=for-the-badge&logo=github" alt="Live Demo">
  </a>
</p>
<p align="center">
  <img src="https://img.shields.io/badge/Network-GenLayer_Studio-blue.svg" alt="Network">
  <img src="https://img.shields.io/badge/Chain_ID-61999-brightgreen.svg" alt="Chain ID">
  <img src="https://img.shields.io/badge/Smart_Contract-Python-yellow.svg" alt="Python">
  <img src="https://img.shields.io/badge/License-MIT-purple.svg" alt="License">
</p>
---
## 🌐 Live dApp
The frontend is live and deployed via GitHub Pages:  
👉 **[Launch VeriCampaign dApp](https://dorinalunar.github.io/vericampaign-escrow-dapp/frontend/)**
---
## 📖 About the Project
**VeriCampaign** is an intelligent escrow platform designed for decentralized marketing, ambassador sprints, and bounty campaigns. It eliminates trust assumptions between Sponsors and Content Creators by utilizing **GenVM (GenLayer Virtual Machine)**.
Instead of relying on a human manager to verify if a creator fulfilled the campaign requirements (e.g., specific mentions, hashtags, brand guidelines), VeriCampaign fetches the submitted web content on-chain and runs a comparative AI consensus to output a definitive verdict (`APPROVED`, `PARTIAL`, `REVISION`, or `REJECTED`).
### ✨ Key Features
* **🤖 GenVM AI Consensus:** Validates text, brand guidelines, and tone directly on-chain.
* **🛡️ Strict Source-Policy:** Automatically blocks SSRF attempts, local/private IPs (e.g., `192.168.x.x`), and binary payloads (`.pdf`, `.mp4`).
* **⚖️ Multi-Role Architecture:** Distinct execution roles for `Sponsor`, `Creator`, and `Arbiter`.
* **💸 Autonomous Payouts:** Funds are locked in escrow and released automatically upon AI approval or Pro-Rata (Partial) AI verdicts.
* **🌐 Web3 Native Frontend:** Fully decentralized UI communicating directly with the GenLayer RPC.
---
## 🏗️ Architecture & Tech Stack
* **Smart Contracts:** Python (`genlayer` library)
* **Frontend:** Vanilla JS, HTML5, CSS3
* **Web3 SDK:** `genlayer-js` / Ethers.js
* **Network:** GenLayer Studio Testnet (`rpc-studio.genlayer.com`)
### Network Details

| Parameter | Value |
| :--- | :--- |
| **Network Name** | GenLayer Studio |
| **Chain ID** | `61999` (`0xf22f`) |
| **Contract Address** | `0x40fd21C11265024CF583852cfe3434Ab2b58F5A6` |
| **Explorer** | [explorer-studio.genlayer.com](https://explorer-studio.genlayer.com) |

---
## 🚀 How to Use (Command Center)
You can interact with the protocol via our **[Live dApp](https://dorinalunar.github.io/vericampaign-escrow-dapp/frontend/)**. Make sure **MetaMask** is installed. The application will automatically prompt you to connect to the GenLayer Studio network.
### Role 1: Sponsor (Campaign Setup)
1. **Connect Wallet**: Click the top right button to connect.
2. **Create Campaign**: Navigate to Panel 1. Enter a Title, Description, Arbiter Address, and Deadline. Click **Create Campaign**.
3. **Fund Bounty**: Enter the newly created Campaign ID (e.g., `0`), define the Bounty Title, strict **Brand Guidelines**, and the reward amount. Click **Fund Bounty** to lock `GEN` tokens in escrow.
### Role 2: Creator (Execution)
*Note: A Creator must use a different wallet address than the Sponsor.*
1. **Accept Campaign**: In Panel 2, enter the Campaign ID and required bond (if any). Click **Accept & Lock Bond**.
2. **Submit Content**: Enter the Campaign ID and Bounty Index (usually `0`). Paste the public URL of your published work (e.g., a public web article or raw markdown link). Click **Submit for Review**.
   * *Security Note: The contract will reject any non-HTTP/HTTPS links, local IPs, or binary file extensions.*
### Role 3: GenVM AI (Audit)
1. **Request Verification**: In Panel 3, enter the Campaign ID and Bounty Index. Click **Run Intelligent Verification**.
2. **Wait for Consensus**: GenVM validators will fetch the webpage, read the text, compare it against the Sponsor's Brand Guidelines, and reach a consensus.
3. **Read State**: Use the **Get Bounty** button to view the final JSON verdict (Approved, Rejected, Needs Revision, or Partial Payout). Payouts are executed immediately based on the verdict.
### Role 4: Arbiter (Dispute Resolution)
If a Creator or Sponsor disagrees with an outcome, they can raise a dispute.
1. **Raise Dispute**: Provide a reason in Panel 4 to freeze the bounty.
2. **Resolve Dispute**: The designated Arbiter reviews the case off-chain and executes a final `APPROVE` or `REJECT` on-chain.
---
## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
