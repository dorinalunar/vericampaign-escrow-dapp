# Security Policy
## Supported Versions
Currently, only the `main` branch of the VeriCampaign smart contract deployed on the GenLayer Studio network is supported with security updates.

| Version | Supported |
| :--- | :--- |
| main | :white_check_mark: |
| < 1.0.0 | :x: |

## Reporting a Vulnerability
We take the security of the VeriCampaign protocol seriously, especially regarding:
* Bypass of the Source-Policy URL guardrails (SSRF, local IP routing).
* Manipulation of the GenVM AI Consensus (Prompt Injection / Jailbreaking).
* Flaws in the escrow payout logic (fund locking/draining).
If you discover a critical security vulnerability, please **DO NOT** open a public issue. 
Instead, reach out directly to the repository maintainer via direct message or email. We will review the report and attempt to address it and patch the contract promptly.
