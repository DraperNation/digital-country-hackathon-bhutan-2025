// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./InvoiceNFT.sol";
import "./Staking.sol";
import "./IStaking.sol";
import "./IBorrowRegistry.sol";

/**
 * @title LendingPool
 * @dev Handles lending and borrowing against invoice NFTs
 */
contract LendingPool is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    // Custom Errors
    error NoStakedTokensFound();
    error InsufficientBalance();
    error InsufficientLiquidity();
    error InvalidAmount();
    error InvalidBorrowAmount();
    error InvoiceExpired();
    error LoanAlreadyExists();
    error InvoiceNotVerified();
    error NotInvoiceSupplier();
    error LoanAlreadySettled();
    error LoanNotOverdue();
    error NotLoanOwner();

    // Constants
    uint256 public constant BORROW_CAP_PERCENTAGE = 60; // 60% of invoice amount
    uint256 public constant BASIS_POINTS = 10000;
    uint256 public constant BORROWER_INTEREST_RATE = 1000; // 10% APR
    uint256 public constant LP_INTEREST_RATE = 800; // 8% APR
    uint256 public constant PLATFORM_FEE = 200; // 2% APR

    // State variables
    IERC20 public immutable metrikToken;
    IERC20 public immutable stablecoin;
    InvoiceNFT public immutable invoiceNFT;
    Staking public immutable staking;
    IStaking public immutable iStaking;
    IBorrowRegistry public borrowRegistry;
    uint256 public totalDeposits;
    uint256 public totalBorrowed;
    uint256 public platformFees;
    uint256 public lastInterestUpdate;

    struct Loan {
        uint256 invoiceId;
        uint256 amount;
        uint256 dueDate;
        bool isRepaid;
        bool isLiquidated;
        uint256 interestAccrued;
        uint256 lastInterestUpdate;
        address supplier;
        uint256 borrowAmount;
        uint256 borrowTime;
    }

    struct LPInfo {
        uint256 depositAmount;
        uint256 interestAccrued;
        uint256 lastInterestUpdate;
    }

    struct LPDeposit {
        uint256 amount;
        uint256 depositTime;
        uint256 lastInterestClaimed;
        uint256 withdrawnAmount;
    }

    // Mappings
    mapping(address => LPInfo) public lpInfo;
    mapping(uint256 => Loan) public loans;
    mapping(address => uint256[]) public userLoans;
    mapping(string => bool) public blacklistedSuppliers;
    mapping(address => mapping(uint256 => bool)) public userActiveLoans; // user => tokenId => isActive
    mapping(address => uint256) public userTotalBorrowed;
    mapping(address => LPDeposit[]) public lpDeposits;

    // Events
    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);
    event InterestWithdraw(address indexed user, uint256 amount);
    event Borrow(address indexed user, uint256 invoiceId, uint256 amount);
    event Repay(address indexed user, uint256 invoiceId, uint256 amount);
    event Liquidate(uint256 indexed invoiceId, address indexed liquidator, uint256 amount);
    event SupplierBlacklisted(string supplierId);
    event InvoiceBurned(uint256 indexed invoiceId);
    event LoanCreated(uint256 indexed invoiceId, address indexed supplier, uint256 amount);
    event LoanRepaid(uint256 indexed invoiceId, address indexed supplier, uint256 amount);
    event LoanLiquidated(uint256 indexed invoiceId, address indexed supplier, uint256 amount);
    event DebugLog(string message, address indexed supplier);
    event DebugLogValue(string message, uint256 value);

    constructor(
        address _metrikToken,
        address _stablecoin,
        address _invoiceNFT,
        address _staking
    ) Ownable(msg.sender) {
        metrikToken = IERC20(_metrikToken);
        stablecoin = IERC20(_stablecoin);
        invoiceNFT = InvoiceNFT(_invoiceNFT);
        staking = Staking(_staking);
        iStaking = IStaking(_staking);
        lastInterestUpdate = block.timestamp;
    }

    /// @notice Sets the BorrowRegistry address
    /// @param _borrowRegistry The address of the BorrowRegistry contract
    function setBorrowRegistry(address _borrowRegistry) external onlyOwner {
        borrowRegistry = IBorrowRegistry(_borrowRegistry);
    }

    /**
     * @dev Deposit invoice and borrow against it
     * @param tokenId Unique identifier for the invoice NFT
     * @param borrowAmount Amount to borrow (max LTV% of invoice amount)
     */
    function depositInvoiceAndBorrow(
        uint256 tokenId,
        uint256 borrowAmount
    ) external nonReentrant {
        if (borrowAmount == 0) revert InvalidAmount();
        // Get supplier from InvoiceNFT
        address supplier = invoiceNFT.ownerOf(tokenId);
        emit DebugLog("Supplier address", supplier);

        // Get LTV (basis points)
        uint256 ltv = getBorrowingCapacity(supplier);
        emit DebugLogValue("Calculated LTV", ltv);

        // Get invoice details
        InvoiceNFT.InvoiceDetails memory invoice = invoiceNFT.getInvoiceDetails(tokenId);
        emit DebugLogValue("Invoice credit amount", invoice.creditAmount);

        uint256 maxBorrow = (invoice.creditAmount * ltv) / 10000;
        emit DebugLogValue("Max borrow amount", maxBorrow);
        emit DebugLogValue("Requested borrow amount", borrowAmount);

        if (borrowAmount > maxBorrow) revert InvalidBorrowAmount();
        if (invoice.dueDate <= block.timestamp) revert InvoiceExpired();
        if (userActiveLoans[supplier][tokenId]) revert LoanAlreadyExists();
        if (!invoice.isVerified) revert InvoiceNotVerified();

        // Transfer invoice NFT to lending pool
        invoiceNFT.transferFrom(supplier, address(this), tokenId);

        // Create loan
        loans[tokenId] = Loan({
            invoiceId: tokenId,
            amount: borrowAmount,
            dueDate: invoice.dueDate,
            isRepaid: false,
            isLiquidated: false,
            interestAccrued: 0,
            lastInterestUpdate: block.timestamp,
            supplier: supplier,
            borrowAmount: borrowAmount,
            borrowTime: block.timestamp
        });

        // Update user loan tracking
        userLoans[supplier].push(tokenId);
        userActiveLoans[supplier][tokenId] = true;
        userTotalBorrowed[supplier] += borrowAmount;
        totalBorrowed += borrowAmount;

        // Record borrow event
        if (address(borrowRegistry) != address(0)) {
            borrowRegistry.recordBorrow(supplier, tokenId);
        }

        // Transfer borrowed amount to supplier
        stablecoin.safeTransfer(supplier, borrowAmount);

        emit LoanCreated(tokenId, supplier, borrowAmount);
    }

    /**
     * @dev Deposit stablecoins as LP
     * @param amount Amount of stablecoins to deposit
     */
    function deposit(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        
        // Update existing interest if there's a previous deposit
        if (lpInfo[msg.sender].depositAmount > 0) {
            _updateLPInterest(msg.sender);
        }
        
        stablecoin.safeTransferFrom(msg.sender, address(this), amount);
        lpInfo[msg.sender].depositAmount += amount;
        lpInfo[msg.sender].lastInterestUpdate = block.timestamp; // Initialize to current time
        totalDeposits += amount;

        // Add to deposit history
        lpDeposits[msg.sender].push(LPDeposit({
            amount: amount,
            depositTime: block.timestamp,
            lastInterestClaimed: block.timestamp,
            withdrawnAmount: 0
        }));

        emit Deposit(msg.sender, amount);
    }

    /**
     * @dev Withdraw LP deposit
     * @param amount Amount to withdraw
     */
    function withdraw(uint256 amount) external nonReentrant {
        if (amount == 0) revert InvalidAmount();
        if (lpInfo[msg.sender].depositAmount < amount) revert InsufficientBalance();
        
        // Update interest before checking liquidity
        _updateLPInterest(msg.sender);
        
        // Check if there's enough liquidity after updating interest
        uint256 availableLiquidity = totalDeposits - totalBorrowed;
        if (availableLiquidity < amount) revert InsufficientLiquidity();
        
        // Withdraw from deposit positions FIFO
        LPDeposit[] storage deposits = lpDeposits[msg.sender];
        uint256 remaining = amount;
        for (uint256 i = 0; i < deposits.length && remaining > 0; i++) {
            uint256 available = deposits[i].amount - deposits[i].withdrawnAmount;
            uint256 delta = available < remaining ? available : remaining;
            deposits[i].withdrawnAmount += delta;
            remaining -= delta;
        }
        // Update state before transfer
        lpInfo[msg.sender].depositAmount -= amount;
        totalDeposits -= amount;
        
        // Transfer after state updates
        stablecoin.safeTransfer(msg.sender, amount);

        emit Withdraw(msg.sender, amount);
    }

    /**
     * @dev Withdraw accumulated interest
     */
    function withdrawInterest() external nonReentrant {
        LPDeposit[] storage deposits = lpDeposits[msg.sender];
        uint256 totalInterest = 0;
        for (uint256 i = 0; i < deposits.length; i++) {
            uint256 principal = deposits[i].amount - deposits[i].withdrawnAmount;
            if (principal == 0) continue;
            uint256 timeElapsed = block.timestamp - deposits[i].lastInterestClaimed;
            uint256 timeInYears = (timeElapsed * 1e18) / (365 days);
            uint256 interest = (principal * LP_INTEREST_RATE * timeInYears) / (BASIS_POINTS * 1e18);
            if (interest > 0) {
                deposits[i].lastInterestClaimed = block.timestamp;
                totalInterest += interest;
            }
        }
        require(totalInterest > 0, "No interest to withdraw");
        stablecoin.safeTransfer(msg.sender, totalInterest);
        emit InterestWithdraw(msg.sender, totalInterest);
    }

    /**
     * @dev Repay a loan
     * @param invoiceId ID of the invoice NFT
     */
    function repay(uint256 invoiceId) external nonReentrant {
        Loan storage loan = loans[invoiceId];
        require(!loan.isRepaid && !loan.isLiquidated, "Loan already settled");
        bool isLate = block.timestamp > loan.dueDate;
        require(loan.supplier == msg.sender, "Not loan owner");

        // Update interest accrued
        uint256 interest = calculateInterest(loan.amount, loan.lastInterestUpdate, BORROWER_INTEREST_RATE);
        loan.interestAccrued += interest;
        loan.lastInterestUpdate = block.timestamp;

        uint256 totalAmount = loan.amount + loan.interestAccrued;

        stablecoin.safeTransferFrom(msg.sender, address(this), totalAmount);
        
        // Update platform fees
        uint256 platformFee = (loan.interestAccrued * PLATFORM_FEE) / BORROWER_INTEREST_RATE;
        platformFees += platformFee;
        
        // Update loan status
        loan.isRepaid = true;
        userActiveLoans[msg.sender][invoiceId] = false;
        userTotalBorrowed[msg.sender] -= loan.amount;
        totalBorrowed -= loan.amount;

        // Record repayment event
        if (address(borrowRegistry) != address(0)) {
            borrowRegistry.recordRepayment(msg.sender, invoiceId, isLate);
        }

        // Burn the invoice NFT
        invoiceNFT.burn(invoiceId);

        emit LoanRepaid(invoiceId, loan.supplier, totalAmount);
        emit InvoiceBurned(invoiceId);
    }

    /**
     * @dev Liquidate an overdue loan
     * @param invoiceId ID of the invoice NFT
     * @param supplierId Supplier's unique identifier
     */
    function liquidate(uint256 invoiceId, string calldata supplierId) external nonReentrant {
        Loan storage loan = loans[invoiceId];
        require(!loan.isRepaid && !loan.isLiquidated, "Loan already settled");
        require(block.timestamp > loan.dueDate, "Loan not overdue");

        // Update interest accrued
        uint256 interest = calculateInterest(loan.amount, loan.lastInterestUpdate, BORROWER_INTEREST_RATE);
        loan.interestAccrued += interest;
        loan.lastInterestUpdate = block.timestamp;

        uint256 totalAmount = loan.amount + interest;

        // Update platform fees
        uint256 platformFee = (loan.interestAccrued * PLATFORM_FEE) / BORROWER_INTEREST_RATE;
        platformFees += platformFee;
        
        // Update loan status
        loan.isLiquidated = true;
        userActiveLoans[loan.supplier][invoiceId] = false;
        userTotalBorrowed[loan.supplier] -= loan.amount;
        totalBorrowed -= loan.amount;

        // Record default event
        if (address(borrowRegistry) != address(0)) {
            borrowRegistry.recordDefault(loan.supplier, invoiceId);
        }

        // Blacklist supplier
        blacklistedSuppliers[supplierId] = true;

        // Debug log before slashing
        emit DebugLog("Before slashing", loan.supplier);

        // Slash staked tokens
        staking.slashStakedTokens(loan.supplier);

        // Debug log after slashing
        emit DebugLog("After slashing", loan.supplier);

        // Burn the invoice NFT
        invoiceNFT.burn(invoiceId);

        emit LoanLiquidated(invoiceId, loan.supplier, totalAmount);
        emit SupplierBlacklisted(supplierId);
        emit InvoiceBurned(invoiceId);
    }

    /**
     * @dev Update LP interest
     * @param lp Address of the LP
     */
    function _updateLPInterest(address lp) internal {
        LPInfo storage info = lpInfo[lp];
        if (info.depositAmount > 0) {
            // Calculate new interest since last update
            uint256 newInterest = calculateInterest(
                info.depositAmount,
                info.lastInterestUpdate,
                LP_INTEREST_RATE
            );
            // Add only the new interest
            info.interestAccrued += newInterest;
            info.lastInterestUpdate = block.timestamp;
        }
    }

    /**
     * @dev Calculate interest
     * @param principal Principal amount
     * @param startTime Start time
     * @param rate Interest rate
     * @return Interest amount
     */
    function calculateInterest(
        uint256 principal,
        uint256 startTime,
        uint256 rate
    ) public view returns (uint256) {
        uint256 timeElapsed = block.timestamp - startTime;
        // Convert timeElapsed to years (with 18 decimals for precision)
        uint256 timeInYears = (timeElapsed * 1e18) / (365 days);
        // Calculate interest: principal * rate * timeInYears / BASIS_POINTS
        return (principal * rate * timeInYears) / (BASIS_POINTS * 1e18);
    }

    /**
     * @dev Get LP's accumulated interest
     * @param lp Address of the LP
     * @return Interest amount
     */
    function getLPInterest(address lp) external view returns (uint256) {
        LPDeposit[] storage deposits = lpDeposits[lp];
        uint256 totalInterest = 0;
        for (uint256 i = 0; i < deposits.length; i++) {
            uint256 principal = deposits[i].amount - deposits[i].withdrawnAmount;
            if (principal == 0) continue;
            uint256 timeElapsed = block.timestamp - deposits[i].lastInterestClaimed;
            uint256 timeInYears = (timeElapsed * 1e18) / (365 days);
            uint256 interest = (principal * LP_INTEREST_RATE * timeInYears) / (BASIS_POINTS * 1e18);
            totalInterest += interest;
        }
        // Add any accrued interest in lpInfo (legacy)
        totalInterest += lpInfo[lp].interestAccrued;
        return totalInterest;
    }

    /**
     * @dev Get user's active loans
     * @param user Address of the user
     * @return Array of loan IDs
     */
    function getUserLoans(address user) external view returns (uint256[] memory) {
        return userLoans[user];
    }

    /**
     * @dev Get user's active loans
     * @param user Address of the user
     * @return Array of loan IDs
     */
    function getUserActiveLoans(address user) external view returns (uint256[] memory) {
        uint256[] memory allLoans = userLoans[user];
        uint256 activeCount = 0;
        
        // Count active loans
        for (uint256 i = 0; i < allLoans.length; i++) {
            if (userActiveLoans[user][allLoans[i]]) {
                activeCount++;
            }
        }
        
        // Create array of active loans
        uint256[] memory activeLoans = new uint256[](activeCount);
        uint256 currentIndex = 0;
        
        for (uint256 i = 0; i < allLoans.length; i++) {
            if (userActiveLoans[user][allLoans[i]]) {
                activeLoans[currentIndex] = allLoans[i];
                currentIndex++;
            }
        }
        
        return activeLoans;
    }

    function getUserLoanDetails(address user, uint256 tokenId) external view returns (
        uint256 amount,
        uint256 dueDate,
        bool isRepaid,
        bool isLiquidated,
        uint256 interestAccrued
    ) {
        require(userActiveLoans[user][tokenId], "Loan not found or not active");
        Loan storage loan = loans[tokenId];
        
        // Calculate current interest
        uint256 currentInterest = loan.interestAccrued;
        if (!loan.isRepaid && !loan.isLiquidated) {
            currentInterest += calculateInterest(
                loan.amount,
                loan.lastInterestUpdate,
                BORROWER_INTEREST_RATE
            );
        }
        
        return (
            loan.amount,
            loan.dueDate,
            loan.isRepaid,
            loan.isLiquidated,
            currentInterest
        );
    }

    function getUserTotalBorrowed(address user) external view returns (uint256) {
        return userTotalBorrowed[user];
    }

    /**
     * @dev Withdraw platform fees (only owner)
     */
    function withdrawPlatformFees() external onlyOwner {
        uint256 amount = platformFees;
        platformFees = 0;
        stablecoin.safeTransfer(owner(), amount);
    }

    /**
     * @dev Get the maximum borrow amount for a given invoice
     * @param tokenId Unique identifier for the invoice NFT
     * @return Maximum borrow amount
     */
    function getMaxBorrowAmount(uint256 tokenId) public view returns (uint256) {
        InvoiceNFT.InvoiceDetails memory invoice = invoiceNFT.getInvoiceDetails(tokenId);
        uint256 maxBorrowAmount = (invoice.creditAmount * BORROW_CAP_PERCENTAGE) / 100;
        uint256 tier = staking.getTier(msg.sender);
        if (tier > 0) {
            maxBorrowAmount = (maxBorrowAmount * (100 + tier * 10)) / 100; // Each tier increases cap by 10%
        }
        return maxBorrowAmount;
    }

    /**
     * @notice Returns the borrowing capacity (LTV%) for a supplier based on staking, tier, and history
     * @param user The supplier address
     * @return ltv The computed LTV percentage (in basis points, e.g. 4500 = 45%)
     */
    function getBorrowingCapacity(address user) public view returns (uint256 ltv) {
        uint256 baseLTV = 3000; // 30% in basis points
        uint256 trustScore = _calculateTrustScore(user); // in basis points
        uint256 stakeBonus = _calculateStakeBonus(user); // in basis points
        int256 historyScore = _calculateHistoryScore(user); // in basis points (can be negative)

        uint256 total = baseLTV + trustScore + stakeBonus;
        if (historyScore > 0) {
            total += uint256(historyScore);
        } else if (historyScore < 0) {
            uint256 penalty = uint256(historyScore * -1);
            if (total > penalty) {
                total -= penalty;
            } else {
                total = 0; // Prevent underflow
            }
        }

        if (total > 7500) {
            total = 7500;
        } else if (total < 3000) {
            total = 3000;
        }
        return total;
    }

    /**
     * @notice Calculates the trust score (tier multiplier) for a user
     * @param user The supplier address
     * @return score The trust score in basis points
     */
    function _calculateTrustScore(address user) internal view returns (uint256 score) {
        uint8 tier = iStaking.getTier(user);
        if (tier == 1) { // Bronze -> Silver in new system
            return 500; // +5%
        } else if (tier == 2) { // Silver -> Gold
            return 1000; // +10%
        } else if (tier == 3) { // Gold -> Diamond
            return 1500; // +15%
        } else if (tier == 4) { // Diamond -> Diamond+
            return 2000; // +20%
        }
        return 0; // No bonus for no tier
    }

    /**
     * @notice Calculates the stake bonus for a user
     * @param user The supplier address
     * @return bonus The stake bonus in basis points
     */
    function _calculateStakeBonus(address user) internal view returns (uint256 bonus) {
        uint256 stakedAmount = iStaking.getStakedAmount(user);
        uint256 duration = iStaking.getStakeDuration(user); // in days
        if (stakedAmount == 0 || duration == 0) return 0;

        // Normalize staked amount (18 decimals)
        uint256 normalizedAmount = stakedAmount / 1e18;

        // log10(normalizedAmount) approximation: count digits - 1
        uint256 digits = 0;
        uint256 temp = normalizedAmount;
        while (temp > 0) {
            temp /= 10;
            digits++;
        }
        uint256 log10Amount = digits > 0 ? digits - 1 : 0;

        // Duration multiplier
        uint256 durationMultiplier = 10; // 1x = 10
        if (duration >= 365) {
            durationMultiplier = 20; // 2x
        } else if (duration >= 180) {
            durationMultiplier = 15; // 1.5x
        } else if (duration >= 90) {
            durationMultiplier = 13; // 1.3x
        } else if (duration >= 45) {
            durationMultiplier = 10; // 1x
        }
        // StakeBonus = log10(normalizedAmount) * durationMultiplier * 2%
        // 2% = 200 basis points
        uint256 rawBonus = log10Amount * durationMultiplier * 200 / 10; // scale back by 10
        if (rawBonus > 1000) rawBonus = 1000; // Cap at 10%
        return rawBonus;
    }

    /**
     * @notice Calculates the history score for a user
     * @param user The supplier address
     * @return score The history score in basis points (can be negative)
     */
    function _calculateHistoryScore(address user) internal view returns (int256 score) {
        if (address(borrowRegistry) == address(0)) return 0;

        uint256 defaults = borrowRegistry.getDefaults(user);
        uint256 lateRepayments = borrowRegistry.getLateRepayments(user);
        uint256 successfulLoans = borrowRegistry.getSuccessfulLoans(user);

        int256 currentScore = 0;

        if (defaults == 0) {
            currentScore += 1000; // +10%
        } else if (defaults >= 2) {
            currentScore -= 1500; // -15%
        }

        if (lateRepayments >= 1 && lateRepayments <= 2) {
            currentScore -= 500; // -5%
        }

        if (successfulLoans >= 5) {
            currentScore += 500; // +5%
        }

        return currentScore;
    }
} 