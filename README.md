<p align="center">
  <img src="./frontend/logo.svg" alt="VeriCampaign Logo" width="110">
</p>

# 🛡️ VeriCampaign (GenLayer Full-Stack dApp)

[![Network](https://img.shields.io/badge/NETWORK-GENLAYER%20STUDIO-blue?style=flat-square)](https://studio.genlayer.com)
[![Smart Contract](https://img.shields.io/badge/SMART%20CONTRACT-PYTHON%203.10+-yellow?style=flat-square)](https://genlayer.com)
[![Frontend](https://img.shields.io/badge/FRONTEND-VANILLA%20JS-orange?style=flat-square)](https://dorinalunar.github.io/vericampaign-escrow-dapp/frontend/)
[![SDK](https://img.shields.io/badge/SDK-GENLAYER--JS-brightgreen?style=flat-square)](https://esm.sh/genlayer-js)
[![License](https://img.shields.io/badge/LICENSE-MIT-purple?style=flat-square)](LICENSE)

> Demonstrating the power of Intelligent Smart Contracts and Agentic UI design for decentralized escrow and deliverables verification.

**VeriCampaign** is a full-stack Intelligent dApp built for the GenLayer ecosystem. It operates as an autonomous escrow protocol where GenVM's comparative AI consensus audits promotional web deliverables against sponsor brand guidelines, managing milestone releases, security bonds, revisions, and arbiter disputes completely on-chain.

---

## 🌍 Real-World Use Cases

* **Web3 Ambassador Programs:** Sponsors lock reward pools for community ambassadors, automatically verifying thread mentions, keywords, and tone without human managerial overhead.
* **Bounty & Hackathon Grants:** Micro-grants released autonomously when builders provide verifiable public documentation or project links meeting exact technical criteria.
* **Autonomous Milestone Escrow:** Creators lock a security bond and receive pro-rata or full payouts immediately upon positive AI evaluation without trust assumptions.

---

## 📜 Deployment Details

* **Network:** GenLayer Studio (Chain ID: 61999)
* **Contract Address:** `0x40fd21C11265024CF583852cfe3434Ab2b58F5A6`
* **Explorer:** [explorer-studio.genlayer.com](https://explorer-studio.genlayer.com)
* **Live Web App:** [Launch VeriCampaign dApp](https://dorinalunar.github.io/vericampaign-escrow-dapp/frontend/)

---

## 🛠️ Tech Stack & Architecture

This dApp demonstrates a resilient, mobile-friendly Web3 architecture tailored specifically for the GenLayer ecosystem:

* **Smart Contract:** Native Python using the py-genlayer SDK, implementing deterministic state machines alongside non-deterministic web retrieval and comparative AI consensus.
* **Source-Policy Guardrails:** On-chain URL sanitization blocking SSRF, private IPs (localhost, 127.0.0.1, RFC 1918), oversized payloads, and non-text binary extensions.
* **Frontend Modular Design:** Built with Vanilla JS and ES Modules (via esm.sh) for seamless browser deployment with zero build tools.
* **SDK Integration:** Utilizes official genlayer-js for both contract write operations (MetaMask EIP-1193 provider with chain auto-switching) and deterministic state queries.

---

## ✨ Key Features

### 🖥️ Agentic Command Center (Frontend)

* **Seamless Web3 Integration:** Connect via MetaMask to GenLayer Studio directly from the browser with automatic chain-switching.
* **4-Panel Dashboard:** Intuitive UI covering the entire lifecycle: Setup, Submission, AI Execution, and Block Explorer views.
* **Real-time Event Console:** Track transaction hashes, state changes, and AI rationale directly in the UI.

### 🧠 Intelligent Contract (Backend)

* **AI-Powered Consensus:** Utilizes GenLayer's non-deterministic web render and comparative AI prompting to semantically analyze incoming text deliverables against guidelines.
* **Steward Override System:** Designated arbiters can manually resolve deadlocks or override AI decisions.
* **Granular Role Controls:** Explicit permission checks separating Sponsor, Creator, Arbiter, and Admin.
* **Equivalence Principle Safety:** Enforces strict deterministic JSON outputs and payout bucket rounding across validators.

---

## 🚀 How to Use the dApp

The frontend is divided into four main operational panels. Connect your wallet (GenLayer Studio network) and follow the flow:

### 1. ⚙️ Setup & Admin (Sponsor Setup)
* **Create Campaign:** Provide title, description, arbiter address, deadline duration, and bond requirement.
* **Add Bounty:** Define specific brand guidelines and lock the bounty reward funds.

### 2. 📝 Submission Cycle (Creator)
* **Accept Campaign:** Accept terms and deposit the security bond.
* **Submit Content:** Enter the public URL containing the completed deliverable for verification.

### 3. 🧠 AI & Execution
* **Request Verification:** Trigger GenVM validators to analyze the page content against brand guidelines.
* **Autonomous Release:** AI consensus determines whether funds are released, refunded, or split.

### 4. ⚖️ Arbitration (Views & Dispute)
* **Raise Dispute:** Freeze disputed bounties for human review.
* **Resolve Dispute:** Arbiter issues the definitive ruling on-chain.

---

## 🔧 Local Development

Since the dApp is built with a modular Vanilla JS architecture and uses CDN imports (esm.sh), running it locally requires zero build tools:

1. Clone the repository: `git clone https://github.com/dorinalunar/vericampaign-escrow-dapp.git`
2. Open `frontend/index.html` in any modern web browser or serve via: `python -m http.server 8158`
3. Connect your MetaMask to the GenLayer Studio network.

---

## 🗺️ Future Roadmap

* **Phase 1 (Mainnet Deployment):** Migrate the intelligent contract to the GenLayer Mainnet upon official network launch.
* **Phase 2 (Multi-Agent Dispute Resolution):** Introduce secondary AI validation models for cross-verification on manual check outcomes.
* **Phase 3 (Dynamic Frontend Theming):** Enhance the UI with fully customizable themes for protocols building on top of the registry.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
