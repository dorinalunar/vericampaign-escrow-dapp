import { createClient } from "https://esm.sh/genlayer-js";
import { studionet } from "https://esm.sh/genlayer-js/chains";

const CONTRACT_ADDRESS = "0x40fd21C11265024CF583852cfe3434Ab2b58F5A6";

// GenLayer Studio Chain (61999)
const studio61999 = {
    ...studionet,
    id: 61999,
    name: "GenLayer Studio",
    rpcUrls: {
        default: {
            http: ["https://studio.genlayer.com/api"],
        },
        public: {
            http: ["https://studio.genlayer.com/api"],
        },
    },
};

let userAccount = null;
const readClient = createClient({ chain: studio61999 });

// UI Logger
function logToConsole(consoleId, msg, type = 'normal') {
    const el = document.getElementById(consoleId);
    if (!el) return;
    const time = new Date().toLocaleTimeString();
    const prefix = type === 'error' ? 'ERROR:' : (type === 'success' ? 'SUCCESS:' : 'INFO:');
    el.textContent = `[${time}] ${prefix}\n${msg}\n\n` + el.textContent;
    el.style.color = type === 'error' ? '#f87171' : (type === 'success' ? '#4ade80' : '#999999');
}

// Wallet Connection
async function connectWallet() {
    if (!window.ethereum) {
        alert("Please install MetaMask!");
        return null;
    }
    try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        userAccount = accounts[0];

        // Switch network to 61999 (0xf22f)
        try {
            await window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: "0xf22f" }],
            });
        } catch (switchError) {
            if (switchError.code === 4902) {
                await window.ethereum.request({
                    method: "wallet_addEthereumChain",
                    params: [{
                        chainId: "0xf22f",
                        chainName: "GenLayer Studio",
                        nativeCurrency: { name: "GEN", symbol: "GEN", decimals: 18 },
                        rpcUrls: ["https://studio.genlayer.com/api"],
                        blockExplorerUrls: ["https://explorer-studio.genlayer.com"]
                    }],
                });
            }
        }

        const walletText = document.getElementById('walletText');
        if (walletText) walletText.innerText = userAccount.slice(0, 6) + "..." + userAccount.slice(-4);

        const statusDot = document.getElementById('statusDot');
        if (statusDot) {
            statusDot.classList.add('connected');
            statusDot.style.backgroundColor = '#4ade80';
        }

        logToConsole('sponsorConsole', `Wallet connected: ${userAccount}`, 'normal');
        return userAccount;
    } catch (error) {
        console.error("Connection error:", error);
        return null;
    }
}

// Transaction Helpers
async function executeTx(functionName, args = [], value = 0n, consoleId = 'sponsorConsole') {
    if (!userAccount) {
        const connected = await connectWallet();
        if (!connected) {
            return logToConsole(consoleId, "Error: Connect wallet first.", "error");
        }
    }

    try {
        logToConsole(consoleId, `Preparing ${functionName}...\nPlease confirm in MetaMask.`, "normal");

        const client = createClient({ 
            chain: studio61999, 
            provider: window.ethereum, 
            account: userAccount 
        });

        const txParams = {
            address: CONTRACT_ADDRESS,
            functionName: functionName,
            args: args
        };
        if (value > 0n) {
            txParams.value = value;
        }

        const tx = await client.writeContract(txParams);
        const hash = typeof tx === "string" ? tx : (tx.txId || tx.hash);
        logToConsole(consoleId, `Transaction sent!\nMethod: ${functionName}\nHash: ${hash}`, "success");
    } catch (error) {
        console.error("Execution error:", error);
        logToConsole(consoleId, `Failed: ${error.shortMessage || error.message || 'Transaction rejected'}`, "error");
    }
}

async function readData(functionName, args = [], consoleId = 'aiConsole') {
    try {
        logToConsole(consoleId, `Querying ${functionName}...`, "normal");

        const result = await readClient.readContract({
            address: CONTRACT_ADDRESS,
            functionName: functionName,
            args: args
        });

        let displayStr = result;
        try {
            displayStr = JSON.stringify(
                typeof result === 'string' ? JSON.parse(result) : result, 
                (k, v) => typeof v === 'bigint' ? v.toString() : v, 
                2
            );
        } catch (e) {}

        logToConsole(consoleId, `Result:\n${displayStr}`, "success");
    } catch (error) {
        console.error("Read error:", error);
        logToConsole(consoleId, `Error: ${error.shortMessage || error.message || 'Execution reverted'}`, "error");
    }
}

// Init
document.addEventListener("DOMContentLoaded", () => {
    const addrEl = document.getElementById("contractAddr");
    if (addrEl) {
        addrEl.textContent = `Contract: ${CONTRACT_ADDRESS.slice(0, 6)}...${CONTRACT_ADDRESS.slice(-4)}`;
    }

    document.getElementById('connectBtn')?.addEventListener('click', connectWallet);

    // Panel 1: Sponsor
    document.getElementById("btnCreateCampaign")?.addEventListener("click", () => {
        const title = document.getElementById("campTitle")?.value.trim() || "";
        const desc = document.getElementById("campDesc")?.value.trim() || "";
        const arbiter = document.getElementById("campArbiter")?.value.trim() || "";
        const deadline = BigInt(document.getElementById("campDeadline")?.value || "3600");
        const bond = BigInt(document.getElementById("campBond")?.value || "0");

        if (!title || !arbiter) {
            return logToConsole('sponsorConsole', 'Error: Title and Arbiter required.', 'error');
        }
        executeTx('create_campaign', [title, desc, arbiter, deadline, bond], 0n, 'sponsorConsole');
    });

    document.getElementById("btnAddBounty")?.addEventListener("click", () => {
        const campId = BigInt(document.getElementById("bountyCampId")?.value || "0");
        const title = document.getElementById("bountyTitle")?.value.trim() || "";
        const guidelines = document.getElementById("bountyGuidelines")?.value.trim() || "";
        const amount = BigInt(document.getElementById("bountyAmount")?.value || "0");

        if (!title || !guidelines || amount <= 0n) {
            return logToConsole('sponsorConsole', 'Error: Title, Guidelines, and Amount (>0) required.', 'error');
        }
        executeTx('add_bounty', [campId, title, "Bounty Deliverable", guidelines, amount], amount, 'sponsorConsole');
    });

    // Panel 2: Creator
    document.getElementById("btnAcceptCampaign")?.addEventListener("click", () => {
        const campId = BigInt(document.getElementById("acceptCampId")?.value || "0");
        const bond = BigInt(document.getElementById("acceptBond")?.value || "0");
        executeTx('accept_campaign', [campId], bond, 'creatorConsole');
    });

    document.getElementById("btnSubmitContent")?.addEventListener("click", () => {
        const campId = BigInt(document.getElementById("subCampId")?.value || "0");
        const idx = BigInt(document.getElementById("subBountyIdx")?.value || "0");
        const url = document.getElementById("subUrl")?.value.trim() || "";

        if (!url) {
            return logToConsole('creatorConsole', 'Error: Valid Content URL required.', 'error');
        }
        executeTx('submit_content', [campId, idx, url], 0n, 'creatorConsole');
    });

    // Panel 3: AI Verification & State
    document.getElementById("btnRequestVerification")?.addEventListener("click", () => {
        const campId = BigInt(document.getElementById("aiCampId")?.value || "0");
        const idx = BigInt(document.getElementById("aiBountyIdx")?.value || "0");
        executeTx('request_verification', [campId, idx], 0n, 'aiConsole');
    });

    document.getElementById("btnViewCampaign")?.addEventListener("click", () => {
        const campId = BigInt(document.getElementById("viewCampId")?.value || "0");
        readData('get_campaign', [campId], 'aiConsole');
    });

    document.getElementById("btnViewBounty")?.addEventListener("click", () => {
        const campId = BigInt(document.getElementById("viewCampId")?.value || "0");
        const idx = BigInt(document.getElementById("viewBountyIdx")?.value || "0");
        readData('get_bounty', [campId, idx], 'aiConsole');
    });

    // Panel 4: Dispute & Admin
    document.getElementById("btnRaiseDispute")?.addEventListener("click", () => {
        const campId = BigInt(document.getElementById("dispCampId")?.value || "0");
        const idx = BigInt(document.getElementById("dispBountyIdx")?.value || "0");
        const reason = document.getElementById("dispReason")?.value.trim() || "Dispute initiated";
        executeTx('raise_dispute', [campId, idx, reason], 0n, 'adminConsole');
    });

    document.getElementById("btnResolveDispute")?.addEventListener("click", () => {
        const campId = BigInt(document.getElementById("dispCampId")?.value || "0");
        const idx = BigInt(document.getElementById("dispBountyIdx")?.value || "0");
        const verdict = document.getElementById("dispVerdict")?.value || "APPROVE";
        const note = document.getElementById("dispReason")?.value.trim() || "Arbiter ruling";
        executeTx('resolve_dispute', [campId, idx, verdict, note], 0n, 'adminConsole');
    });

    document.getElementById("btnSetPaused")?.addEventListener("click", () => {
        const state = document.getElementById("pauseState")?.value === "true";
        executeTx('set_paused', [state], 0n, 'adminConsole');
    });
});