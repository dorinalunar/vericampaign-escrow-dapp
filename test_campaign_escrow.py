import pytest
import json
from genlayer import *

# ============================================================================
# FIXTURES
# ============================================================================

@pytest.fixture
def deployer():
    return Address("0x1111111111111111111111111111111111111111")

@pytest.fixture
def sponsor():
    return Address("0x2222222222222222222222222222222222222222")

@pytest.fixture
def creator():
    return Address("0x3333333333333333333333333333333333333333")

@pytest.fixture
def arbiter():
    return Address("0x4444444444444444444444444444444444444444")

@pytest.fixture
def contract(deployer):
    with gl.as_account(deployer):
        # Assuming the file is named ContentCampaignEscrow.py in your repo
        instance = gl.deploy("ContentCampaignEscrow.py")
    return instance

# ============================================================================
# TESTS
# ============================================================================

def test_source_policy_controls(contract, sponsor, creator, arbiter):
    """
    CRITICAL TEST: Verifies that the steward's requirement for 
    stronger source-policy controls is fully enforced.
    """
    # 1. Setup Campaign & Bounty
    with gl.as_account(sponsor):
        campaign_id = contract.create_campaign(
            title="DeAI Marketing Sprint",
            description="Create threads about GenLayer",
            arbiter_address=arbiter.as_hex,
            deadline_seconds_from_now=86400,
            required_bond=0
        )
        
        # Note: In a real simulation, gl.message.value is injected. 
        # For py-genlayer tests, assuming value bypass or environment setup.
        bounty_idx = contract.add_bounty(
            campaign_id=campaign_id,
            title="Twitter Thread",
            description="Deep dive into VeriCampaign",
            brand_guidelines="Mention #GenLayer",
            amount=500
        )

    # 2. Creator accepts the campaign
    with gl.as_account(creator):
        contract.accept_campaign(campaign_id)

        # --- POLICY TEST A: Invalid Protocol ---
        with pytest.raises(gl.vm.UserError, match="HALT: Only HTTP and HTTPS protocols are permitted"):
            contract.submit_content(campaign_id, bounty_idx, "ftp://my-server.com/doc.txt")

        # --- POLICY TEST B: SSRF / Local Network Protection ---
        with pytest.raises(gl.vm.UserError, match="HALT: Local or private network URLs are prohibited"):
            contract.submit_content(campaign_id, bounty_idx, "http://localhost:8080/admin")
            
        with pytest.raises(gl.vm.UserError, match="HALT: Local or private network URLs are prohibited"):
            contract.submit_content(campaign_id, bounty_idx, "https://127.0.0.1/sensitive-data")

        # --- POLICY TEST C: Disallowed File Extensions (Binary / Non-text) ---
        with pytest.raises(gl.vm.UserError, match="HALT: Binary or unsupported file type detected"):
            contract.submit_content(campaign_id, bounty_idx, "https://my-portfolio.com/promo_video.mp4")
            
        with pytest.raises(gl.vm.UserError, match="HALT: Binary or unsupported file type detected"):
            contract.submit_content(campaign_id, bounty_idx, "https://drive.com/brand_assets.zip")

        # --- POLICY TEST D: Valid Submission ---
        valid_url = "https://x.com/my_web3_thread/status/123456"
        contract.submit_content(campaign_id, bounty_idx, valid_url)
        
        bounty_state = contract.get_bounty(campaign_id, bounty_idx)
        assert bounty_state["status_label"] == "SUBMITTED", "Bounty should successfully transition to SUBMITTED"
        assert bounty_state["content_url"] == valid_url, "Valid URL should be stored"


def test_dispute_and_arbitration_lifecycle(contract, sponsor, creator, arbiter):
    """
    Verifies that the multi-role dispute resolution works correctly.
    """
    with gl.as_account(sponsor):
        campaign_id = contract.create_campaign(
            title="Dispute Scenario",
            description="Testing arbiter override",
            arbiter_address=arbiter.as_hex,
            deadline_seconds_from_now=86400,
            required_bond=0
        )
        bounty_idx = contract.add_bounty(
            campaign_id=campaign_id,
            title="Blog Post",
            description="Write a Medium article",
            brand_guidelines="Strict guidelines",
            amount=1000
        )

    with gl.as_account(creator):
        contract.accept_campaign(campaign_id)
        contract.submit_content(campaign_id, bounty_idx, "https://medium.com/article")

    # Sponsor raises a dispute claiming poor quality
    with gl.as_account(sponsor):
        contract.raise_dispute(campaign_id, bounty_idx, "Content does not meet basic guidelines")
        bounty = contract.get_bounty(campaign_id, bounty_idx)
        assert bounty["status_label"] == "DISPUTED"

    # Arbiter steps in and rules in favor of the creator (APPROVE)
    with gl.as_account(arbiter):
        contract.resolve_dispute(campaign_id, bounty_idx, "APPROVE", "Content meets the minimum required standards.")
        
        resolved_bounty = contract.get_bounty(campaign_id, bounty_idx)
        assert resolved_bounty["status_label"] == "PAID", "Arbiter approval should trigger payment"
        assert resolved_bounty["resolved_by_arbiter"] is True


def test_admin_and_treasury_controls(contract, deployer, sponsor):
    """
    Verifies owner controls, fee adjustments, and pause mechanics.
    """
    # Test Fee Update
    with gl.as_account(deployer):
        contract.update_default_fee(1000) # Update to 10%
        
    # Test Pause Mechanism
    with gl.as_account(deployer):
        contract.set_paused(True)

    with gl.as_account(sponsor):
        # Should fail to create campaign while paused
        with pytest.raises(gl.vm.UserError, match="Protocol is paused for new campaigns"):
            contract.create_campaign(
                title="Failed Campaign",
                description="Should revert",
                arbiter_address=deployer.as_hex,
                deadline_seconds_from_now=86400,
                required_bond=0
            )

    # Unpause and verify
    with gl.as_account(deployer):
        contract.set_paused(False)
        
    with gl.as_account(sponsor):
        cid = contract.create_campaign(
            title="Successful Campaign",
            description="Protocol is live",
            arbiter_address=deployer.as_hex,
            deadline_seconds_from_now=86400,
            required_bond=0
        )
        assert cid == 0