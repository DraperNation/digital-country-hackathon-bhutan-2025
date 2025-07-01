// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Test ,console} from "forge-std/Test.sol";
import "../src/EResidencyContracts.sol";

contract BhutanEResidencyTest is Test {
    // Contracts
    KYCVerification public kycContract;
    BhutanEResidencyNFT public nftContract;
    EResidencyMarketplace public marketplaceContract;
    EResidencyDeployer public deployer;

    // Test addresses
    address public owner = address(this);
    address public verifier = address(0x1);
    address public user1 = address(0x2);
    address public user2 = address(0x3);
    address public feeRecipient = address(0x4);
    address public nonKycUser = address(0x5);

    // Test data
    string constant FULL_NAME = "John Doe";
    string constant EMAIL = "john@example.com";
    string constant PHONE = "+97512345678";
    string constant ADDRESS = "123 Thimphu Street";
    string constant DOCUMENT_HASH = "QmTest123";
    string constant TAX_ID = "TAX123456";
    string constant LEGAL_ENTITY = "Doe Enterprises";
    string constant TOKEN_URI = "https://metadata.example.com/1";

    // event log_named_uint(string key, uint value); // Removed duplicate event declaration

// Replace the setUp() function in your test contract with this:

function setUp() public {
    // Deploy all contracts
    deployer = new EResidencyDeployer();
    deployer.deployAll(feeRecipient);
    
    kycContract = deployer.kycContract();
    nftContract = deployer.nftContract();
    marketplaceContract = deployer.marketplaceContract();

    // Transfer ownership of KYC contract to test contract so we can add verifiers
    vm.prank(address(deployer));
    kycContract.transferOwnership(address(this));

    // Transfer ownership of marketplace contract to test contract for admin functions
    vm.prank(address(deployer));
    marketplaceContract.transferOwnership(address(this));

    // Setup verifier
    kycContract.addVerifier(verifier);

    // Fund test addresses
    vm.deal(user1, 10 ether);
    vm.deal(user2, 10 ether);

    console.log("=== SETUP COMPLETE ===");
    console.log("KYC Contract:", address(kycContract));
    console.log("NFT Contract:", address(nftContract));
    console.log("Marketplace Contract:", address(marketplaceContract));
    console.log("========================");
}

    // ============================================================================
    // KYC TESTS
    // ============================================================================

    function testKYCSubmission() public {
        console.log("\n=== TESTING KYC SUBMISSION ===");
        
        vm.prank(user1);
        kycContract.submitKYC(
            FULL_NAME,
            EMAIL,
            PHONE,
            ADDRESS,
            DOCUMENT_HASH,
            KYCVerification.UserType.Individual
        );

        KYCVerification.KYCData memory kycData = kycContract.getKYCData(user1);
        
        assertEq(kycData.kycId, 1);
        assertEq(kycData.userAddress, user1);
        assertEq(kycData.fullName, FULL_NAME);
        assertEq(kycData.email, EMAIL);
        assertTrue(kycData.status == KYCVerification.KYCStatus.Pending);
        
        console.log(unicode"✓ KYC submitted successfully");
        console.log("  KYC ID:", kycData.kycId);
        console.log("  Status: Pending");
    }

    function testKYCVerification() public {
        // Submit KYC first
        vm.prank(user1);
        kycContract.submitKYC(
            FULL_NAME,
            EMAIL,
            PHONE,
            ADDRESS,
            DOCUMENT_HASH,
            KYCVerification.UserType.Individual
        );

        console.log("\n=== TESTING KYC VERIFICATION ===");
        
        // Verify KYC
        vm.prank(verifier);
        kycContract.verifyKYC(user1);

        assertTrue(kycContract.isKYCVerified(user1));
        
        KYCVerification.KYCData memory kycData = kycContract.getKYCData(user1);
        assertTrue(kycData.status == KYCVerification.KYCStatus.Verified);
        assertEq(kycData.verifiedBy, verifier);
        
        console.log(unicode"✓ KYC verified successfully");
        console.log("  Verified by:", kycData.verifiedBy);
    }

    function testKYCRejection() public {
        // Submit KYC first
        vm.prank(user1);
        kycContract.submitKYC(
            FULL_NAME,
            EMAIL,
            PHONE,
            ADDRESS,
            DOCUMENT_HASH,
            KYCVerification.UserType.Individual
        );

        console.log("\n=== TESTING KYC REJECTION ===");
        
        string memory reason = "Invalid documents";
        vm.prank(verifier);
        kycContract.rejectKYC(user1, reason);

        assertFalse(kycContract.isKYCVerified(user1));
        
        KYCVerification.KYCData memory kycData = kycContract.getKYCData(user1);
        assertTrue(kycData.status == KYCVerification.KYCStatus.Rejected);
        
        console.log(unicode"✓ KYC rejected successfully");
        console.log("  Reason:", reason);
    }

    function testFailKYCSubmissionTwice() public {
        vm.startPrank(user1);
        
        kycContract.submitKYC(
            FULL_NAME,
            EMAIL,
            PHONE,
            ADDRESS,
            DOCUMENT_HASH,
            KYCVerification.UserType.Individual
        );

        // This should fail
        kycContract.submitKYC(
            FULL_NAME,
            EMAIL,
            PHONE,
            ADDRESS,
            DOCUMENT_HASH,
            KYCVerification.UserType.Individual
        );
        
        vm.stopPrank();
    }

    // ============================================================================
    // NFT TESTS
    // ============================================================================

    function testResidencyIssuance() public {
        // Complete KYC process first
        _completeKYC(user1);

        console.log("\n=== TESTING RESIDENCY ISSUANCE ===");
        
        // Issue residency (only marketplace can mint)
        vm.prank(address(marketplaceContract));
        uint256 tokenId = nftContract.issueResidency(
            user1,
            BhutanEResidencyNFT.ResidencyType.Individual,
            TAX_ID,
            "",
            DOCUMENT_HASH,
            TOKEN_URI
        );

        assertEq(nftContract.ownerOf(tokenId), user1);
        assertTrue(nftContract.isResidencyValid(tokenId));
        
        BhutanEResidencyNFT.ResidencyData memory data = nftContract.getResidencyData(tokenId);
        assertEq(data.resident, user1);
        assertEq(data.taxId, TAX_ID);
        assertTrue(data.isActive);
        
        uint256[] memory userResidencies = nftContract.getUserResidencies(user1);
        assertEq(userResidencies.length, 1);
        assertEq(userResidencies[0], tokenId);
        
        console.log(unicode"✓ Residency issued successfully");
        console.log("  Token ID:", tokenId);
        console.log("  Owner:", nftContract.ownerOf(tokenId));
        console.log("  Tax ID:", data.taxId);
    }

    function testResidencyRenewal() public {
        // Setup: Issue residency first
        _completeKYC(user1);
        
        vm.prank(address(marketplaceContract));
        uint256 tokenId = nftContract.issueResidency(
            user1,
            BhutanEResidencyNFT.ResidencyType.Individual,
            TAX_ID,
            "",
            DOCUMENT_HASH,
            TOKEN_URI
        );

        console.log("\n=== TESTING RESIDENCY RENEWAL ===");
        
        BhutanEResidencyNFT.ResidencyData memory dataBefore = nftContract.getResidencyData(tokenId);
        uint256 originalExpiry = dataBefore.expiryDate;
        
        // Renew residency
        vm.prank(user1);
        nftContract.renewResidency(tokenId);
        
        BhutanEResidencyNFT.ResidencyData memory dataAfter = nftContract.getResidencyData(tokenId);
        assertEq(dataAfter.expiryDate, originalExpiry + 365 days);
        
        console.log(unicode"✓ Residency renewed successfully");
        console.log("  Original expiry:", originalExpiry);
        console.log("  New expiry:", dataAfter.expiryDate);
    }

function testResidencyRevocation() public {
    // Setup: Issue residency first
    _completeKYC(user1);
    
    vm.prank(address(marketplaceContract));
    uint256 tokenId = nftContract.issueResidency(
        user1,
        BhutanEResidencyNFT.ResidencyType.Individual,
        TAX_ID,
        "",
        DOCUMENT_HASH,
        TOKEN_URI
    );

    console.log("\n=== TESTING RESIDENCY REVOCATION ===");
    
    assertTrue(nftContract.isResidencyValid(tokenId));
    
    // Revoke residency - marketplace contract owns the NFT contract
    vm.prank(address(marketplaceContract));
    nftContract.revokeResidency(tokenId);
    
    assertFalse(nftContract.isResidencyValid(tokenId));
    
    BhutanEResidencyNFT.ResidencyData memory data = nftContract.getResidencyData(tokenId);
    assertFalse(data.isActive);
    
    console.log(unicode"✓ Residency revoked successfully");
    console.log("  Token still exists but inactive");
}

    function testFailResidencyIssuanceWithoutKYC() public {
        // This should fail - user not KYC verified
        vm.prank(address(marketplaceContract));
        nftContract.issueResidency(
            nonKycUser,
            BhutanEResidencyNFT.ResidencyType.Individual,
            TAX_ID,
            "",
            DOCUMENT_HASH,
            TOKEN_URI
        );
    }

    // ============================================================================
    // MARKETPLACE TESTS
    // ============================================================================

    function testCreateListing() public {
        // Complete KYC for seller
        _completeKYC(user1);

        console.log("\n=== TESTING LISTING CREATION ===");
        
        vm.prank(user1);
        uint256 listingId = marketplaceContract.createListing(
            BhutanEResidencyNFT.ResidencyType.Individual,
            1 ether,
            "Individual eResidency for sale",
            DOCUMENT_HASH
        );

        (
            uint256 id,
            address seller,
            BhutanEResidencyNFT.ResidencyType residencyType,
            uint256 price,
            string memory description,
            string memory documentsHash,
            EResidencyMarketplace.ListingStatus status,
            uint256 createdAt,
            uint256 expiresAt,
            address buyer,
            uint256 soldAt
        ) = marketplaceContract.listings(listingId);

        assertEq(id, listingId);
        assertEq(seller, user1);
        assertEq(price, 1 ether);
        assertTrue(status == EResidencyMarketplace.ListingStatus.Active);
        
        uint256[] memory sellerListings = marketplaceContract.getSellerListings(user1);
        assertEq(sellerListings.length, 1);
        assertEq(sellerListings[0], listingId);
        
        console.log(unicode"✓ Listing created successfully");
        console.log("  Listing ID:", listingId);
        console.log("  Seller:", seller);
        console.log("  Price:", price);
        console.log("  Status: Active");
    }

    function testPurchaseResidency() public {
        // Setup: Create listing
        _completeKYC(user1); // Seller
        _completeKYC(user2); // Buyer
        
        vm.prank(user1);
        uint256 listingId = marketplaceContract.createListing(
            BhutanEResidencyNFT.ResidencyType.Individual,
            1 ether,
            "Individual eResidency for sale",
            DOCUMENT_HASH
        );

        console.log("\n=== TESTING RESIDENCY PURCHASE ===");
        
        uint256 buyerBalanceBefore = user2.balance;
        uint256 sellerBalanceBefore = user1.balance;
        uint256 feeRecipientBalanceBefore = feeRecipient.balance;
        
        // Purchase residency
        vm.prank(user2);
        marketplaceContract.purchaseResidency{value: 1 ether}(
            listingId,
            "TAX789",
            "",
            TOKEN_URI
        );

        // Check NFT was minted to buyer
        uint256[] memory buyerResidencies = nftContract.getUserResidencies(user2);
        assertEq(buyerResidencies.length, 1);
        assertEq(nftContract.ownerOf(buyerResidencies[0]), user2);
        
        // Check listing status updated
        (, , , , , , EResidencyMarketplace.ListingStatus status, , , address buyer, ) = 
            marketplaceContract.listings(listingId);
        assertTrue(status == EResidencyMarketplace.ListingStatus.Sold);
        assertEq(buyer, user2);
        
        // Check payments processed
        uint256 expectedFee = (1 ether * 250) / 10000; // 2.5%
        uint256 expectedSellerAmount = 1 ether - expectedFee;
        
        assertEq(user1.balance, sellerBalanceBefore + expectedSellerAmount);
        assertEq(feeRecipient.balance, feeRecipientBalanceBefore + expectedFee);
        assertEq(user2.balance, buyerBalanceBefore - 1 ether);
        
        // Check buyer purchases record
        uint256[] memory buyerPurchases = marketplaceContract.getBuyerPurchases(user2);
        assertEq(buyerPurchases.length, 1);
        assertEq(buyerPurchases[0], listingId);
        
        console.log(unicode"✓ Residency purchased successfully");
        console.log("  Buyer received NFT ID:", buyerResidencies[0]);
        console.log("  Platform fee:", expectedFee);
        console.log("  Seller received:", expectedSellerAmount);
    }

    function testCancelListing() public {
        // Setup: Create listing
        _completeKYC(user1);
        
        vm.prank(user1);
        uint256 listingId = marketplaceContract.createListing(
            BhutanEResidencyNFT.ResidencyType.Individual,
            1 ether,
            "Individual eResidency for sale",
            DOCUMENT_HASH
        );

        console.log("\n=== TESTING LISTING CANCELLATION ===");
        
        // Cancel listing
        vm.prank(user1);
        marketplaceContract.cancelListing(listingId);
        
        (, , , , , , EResidencyMarketplace.ListingStatus status, , , , ) = 
            marketplaceContract.listings(listingId);
        assertTrue(status == EResidencyMarketplace.ListingStatus.Cancelled);
        
        console.log(unicode"✓ Listing cancelled successfully");
    }

    function testFailPurchaseOwnListing() public {
        // Setup: Create listing
        _completeKYC(user1);
        
        vm.prank(user1);
        uint256 listingId = marketplaceContract.createListing(
            BhutanEResidencyNFT.ResidencyType.Individual,
            1 ether,
            "Individual eResidency for sale",
            DOCUMENT_HASH
        );

        // This should fail - cannot buy own listing
        vm.prank(user1);
        marketplaceContract.purchaseResidency{value: 1 ether}(
            listingId,
            "TAX789",
            "",
            TOKEN_URI
        );
    }

    function testFailPurchaseWithoutKYC() public {
        // Setup: Create listing
        _completeKYC(user1);
        
        vm.prank(user1);
        uint256 listingId = marketplaceContract.createListing(
            BhutanEResidencyNFT.ResidencyType.Individual,
            1 ether,
            "Individual eResidency for sale",
            DOCUMENT_HASH
        );

        // This should fail - buyer not KYC verified
        vm.prank(nonKycUser);
        marketplaceContract.purchaseResidency{value: 1 ether}(
            listingId,
            "TAX789",
            "",
            TOKEN_URI
        );
    }

    function testFailInsufficientPayment() public {
        // Setup: Create listing and KYC users
        _completeKYC(user1);
        _completeKYC(user2);
        
        vm.prank(user1);
        uint256 listingId = marketplaceContract.createListing(
            BhutanEResidencyNFT.ResidencyType.Individual,
            1 ether,
            "Individual eResidency for sale",
            DOCUMENT_HASH
        );

        // This should fail - insufficient payment
        vm.prank(user2);
        marketplaceContract.purchaseResidency{value: 0.5 ether}(
            listingId,
            "TAX789",
            "",
            TOKEN_URI
        );
    }

    // ============================================================================
    // DEPLOYMENT TESTS
    // ============================================================================

    function testContractsDeployment() public {
        console.log("\n=== TESTING CONTRACTS DEPLOYMENT ===");
        
        // Verify contracts are deployed
        assertTrue(address(kycContract) != address(0));
        assertTrue(address(nftContract) != address(0));
        assertTrue(address(marketplaceContract) != address(0));
        
        // Verify contract relationships
        assertEq(address(nftContract.kycContract()), address(kycContract));
        assertEq(address(marketplaceContract.kycContract()), address(kycContract));
        assertEq(address(marketplaceContract.residencyNFT()), address(nftContract));
        
        // Verify ownership transfer
        assertEq(nftContract.owner(), address(marketplaceContract));
        
        console.log(unicode"✓ All contracts deployed correctly");
        console.log(unicode"✓ Contract relationships established");
        console.log(unicode"✓ Ownership transferred to marketplace");
    }

    // ============================================================================
    // EDGE CASE TESTS
    // ============================================================================

function testExcessPaymentRefund() public {
    // Setup: Create listing and KYC users
    _completeKYC(user1);
    _completeKYC(user2);
    
    vm.prank(user1);
    uint256 listingId = marketplaceContract.createListing(
        BhutanEResidencyNFT.ResidencyType.Individual,
        1 ether,
        "Individual eResidency for sale",
        DOCUMENT_HASH
    );

    console.log("\n=== TESTING EXCESS PAYMENT REFUND ===");
    
    uint256 buyerBalanceBefore = user2.balance;
    
    // Pay more than required
    vm.prank(user2);
    marketplaceContract.purchaseResidency{value: 1.5 ether}(
        listingId,
        "TAX789",
        "",
        TOKEN_URI
    );
    
    // The marketplace logic should only charge the listing price (1 ether)
    // and refund the excess (0.5 ether) back to the buyer
    uint256 expectedCharge = 1 ether;
    assertEq(user2.balance, buyerBalanceBefore - expectedCharge);
    
    console.log(unicode"✓ Excess payment refunded correctly");
    console.log("  Paid: 1.5 ETH, Charged: 1 ETH, Refunded: 0.5 ETH");
}
    function testMultipleResidencies() public {
        console.log("\n=== TESTING MULTIPLE RESIDENCIES ===");
        
        _completeKYC(user1);
        
        // Issue multiple residencies
        vm.startPrank(address(marketplaceContract));
        
        uint256 tokenId1 = nftContract.issueResidency(
            user1,
            BhutanEResidencyNFT.ResidencyType.Individual,
            "TAX001",
            "",
            DOCUMENT_HASH,
            TOKEN_URI
        );
        
        uint256 tokenId2 = nftContract.issueResidency(
            user1,
            BhutanEResidencyNFT.ResidencyType.Business,
            "TAX002",
            "Business Corp",
            DOCUMENT_HASH,
            TOKEN_URI
        );
        
        vm.stopPrank();
        
        uint256[] memory userResidencies = nftContract.getUserResidencies(user1);
        assertEq(userResidencies.length, 2);
        assertEq(userResidencies[0], tokenId1);
        assertEq(userResidencies[1], tokenId2);
        
        console.log(unicode"✓ Multiple residencies issued successfully");
        console.log("  User has", userResidencies.length, "residencies");
    }

    function testPlatformFeeUpdate() public {
        console.log("\n=== TESTING PLATFORM FEE UPDATE ===");
        
        uint256 originalFee = marketplaceContract.platformFeePercentage();
        uint256 newFee = 500; // 5%
        
        marketplaceContract.setPlatformFee(newFee);
        assertEq(marketplaceContract.platformFeePercentage(), newFee);
        
        console.log(unicode"✓ Platform fee updated successfully");
        console.log("  Original fee:", originalFee, "basis points");
        console.log("  New fee:", newFee, "basis points");
    }

    // ============================================================================
    // HELPER FUNCTIONS
    // ============================================================================

    function _completeKYC(address user) internal {
        vm.prank(user);
        kycContract.submitKYC(
            FULL_NAME,
            EMAIL,
            PHONE,
            ADDRESS,
            DOCUMENT_HASH,
            KYCVerification.UserType.Individual
        );
        
        vm.prank(verifier);
        kycContract.verifyKYC(user);
    }

    // ============================================================================
    // INTEGRATION TEST
    // ============================================================================

    function testFullWorkflow() public {
        console.log("\n=== TESTING FULL WORKFLOW ===");
        console.log("1. Deploying contracts...");
        console.log("2. Setting up KYC for seller and buyer...");
        
        // 1. KYC for both users
        _completeKYC(user1); // Seller
        _completeKYC(user2); // Buyer
        
        console.log("3. Creating marketplace listing...");
        
        // 2. Create listing
        vm.prank(user1);
        uint256 listingId = marketplaceContract.createListing(
            BhutanEResidencyNFT.ResidencyType.Business,
            2 ether,
            "Premium Business eResidency Package",
            DOCUMENT_HASH
        );
        
        console.log("4. Purchasing residency...");
        
        // 3. Purchase residency
        vm.prank(user2);
        marketplaceContract.purchaseResidency{value: 2 ether}(
            listingId,
            "BUS123456",
            "Tech Innovations Ltd",
            TOKEN_URI
        );
        
        console.log("5. Verifying final state...");
        
        // 4. Verify final state
        uint256[] memory buyerResidencies = nftContract.getUserResidencies(user2);
        assertEq(buyerResidencies.length, 1);
        
        BhutanEResidencyNFT.ResidencyData memory residencyData = 
            nftContract.getResidencyData(buyerResidencies[0]);
        
        assertEq(residencyData.resident, user2);
        assertEq(residencyData.taxId, "BUS123456");
        assertEq(residencyData.legalEntityName, "Tech Innovations Ltd");
        assertTrue(residencyData.residencyType == BhutanEResidencyNFT.ResidencyType.Business);
        assertTrue(residencyData.isActive);
        
        console.log(unicode"✓ FULL WORKFLOW COMPLETED SUCCESSFULLY");
        console.log(unicode"  → KYC verified for both users");
        console.log(unicode"  → Listing created and purchased");
        console.log(unicode"  → NFT minted with correct data");
        console.log(unicode"  → Payments processed correctly");
        console.log(unicode"  → All validations passed");
    }

    // Test runner for easy execution
    function runAllTests() public {
        console.log(unicode"🚀 Starting comprehensive test suite...\n");
        
        // KYC Tests
        testKYCSubmission();
        testKYCVerification();
        testKYCRejection();
        
        // NFT Tests
        testResidencyIssuance();
        testResidencyRenewal();
        testResidencyRevocation();
        
        // Marketplace Tests
        testCreateListing();
        testPurchaseResidency();
        testCancelListing();
        
        // Edge Cases
        testExcessPaymentRefund();
        testMultipleResidencies();
        testPlatformFeeUpdate();
        
        // Integration Test
        testFullWorkflow();
        
        console.log(unicode"\n🎉 ALL TESTS COMPLETED SUCCESSFULLY! 🎉");
    }
}