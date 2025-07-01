// VaultManager.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface OracleInterface {
    function getBTCPrice() external view returns (uint256);
}

// Interface for the DTC token contract, used by VaultManager to interact with it
interface IDTC {
    function mint(address to, uint256 amount) external;
    function burn(address from, address to, uint256 amount) external; // Corrected: burn should be from an address
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

// IMPORTANT: This import is crucial for the `new DTC(address(this))` call
import "./DTC.sol"; // Assuming DTC.sol is in the same directory

contract VaultManager {
    struct Vault {
        uint256 btcCollateral; // In sats (8 decimals) - record of off-chain BTC
        uint256 dtcDebt;        // In wei (18 decimals)
    }

    uint256 public constant COLLATERAL_RATIO = 200; // 200% initial collateralization
    uint256 public constant LIQUIDATION_RATIO = 120; // 120% liquidation threshold (must be lower than COLLATERAL_RATIO)
    uint256 public constant LIQUIDATION_BOUNTY_PERCENT = 5; // 5% bounty for liquidators

    address public immutable treasury;       // The address authorized to call 'deposit' (e.g., your backend relayer)
    OracleInterface public immutable oracle; // BTC/USD price feed contract
    // This is the line that needs to be 'DTC' not 'IDTC' if you are deploying DTC here.
    DTC public immutable dtc; // The DTC token contract instance

    mapping(address => Vault) public vaults;

    // Only the designated treasury address can call functions modified by this
    modifier onlyTreasury() {
        require(msg.sender == treasury, "Only treasury can call");
        _;
    }

    // Events for transparency and off-chain monitoring
    event Deposited(address indexed user, uint256 btcAmount, uint256 dtcMinted);
    event Repaid(address indexed user, uint256 dtcAmount);
    event Liquidated(address indexed user, address indexed liquidator, uint256 debtRepaid, uint256 collateralLiquidated);

    /**
     * @notice Constructor to initialize the contract with oracle and treasury addresses.
     * @param _oracle The address of the Oracle contract.
     * @param _treasury The Ethereum address of the trusted backend relayer/multisig.
     */
    constructor(address _oracle, address _treasury) {
        require(_oracle != address(0), "Oracle address cannot be zero");
        require(_treasury != address(0), "Treasury address cannot be zero");
        oracle = OracleInterface(_oracle);
        treasury = _treasury;
        dtc = new DTC(address(this)); // Deploys a new DTC token contract and sets this contract as its minter
    }

    /**
     * @notice Called by the treasury/off-chain agent after BTC is received and validated.
     * Records the deposit on-chain and mints DTC for the user.
     * @param user The Ethereum address of the user for whom the deposit is being made.
     * @param btcAmount The amount of BTC (in satoshis) to record as collateral.
     * @param dtcToMint The amount of DTC (in raw units, e.g., 30000) to mint for the user.
     */
    function deposit(address user, uint256 btcAmount, uint256 dtcToMint) external onlyTreasury {
        require(user != address(0), "Invalid user");
        require(btcAmount > 0 && dtcToMint > 0, "Invalid amounts");

        uint256 btcPrice = oracle.getBTCPrice(); // USD per BTC, 8 decimals from the oracle
        require(btcPrice > 0, "BTC price cannot be zero");

        // Calculate collateral value in USD (8 decimals) and DTC value (also scaled to 8 decimals for comparison)
        uint256 collateralValue = (btcAmount * btcPrice) / 1e8;
        uint256 dtcValue = dtcToMint * 1e8; // 1 DTC = $1.00, scaled to 8 decimals for comparison

        // Check initial collateralization ratio requirement
        require(dtcValue > 0, "DTC value for ratio check must be greater than zero");
        require((collateralValue * 100) / dtcValue >= COLLATERAL_RATIO, "Undercollateralized");

        Vault storage v = vaults[user];
        v.btcCollateral += btcAmount;
        v.dtcDebt += dtcToMint * 1e18; // Store debt in 1e18 wei for ERC20 compatibility

        dtc.mint(user, dtcToMint * 1e18); // Mint DTC to the user's Ethereum address (scaled to 1e18 wei)
        emit Deposited(user, btcAmount, dtcToMint);
    }

    /**
     * @notice Allows a user to repay DTC debt.
     * @param dtcAmount The amount of DTC (in raw units, e.g., 10000) to repay.
     */
    function repay(uint256 dtcAmount) external {
        require(dtcAmount > 0, "Invalid amount");

        Vault storage v = vaults[msg.sender];
        require(v.dtcDebt >= dtcAmount * 1e18, "Overpaying"); // Ensure user doesn't repay more than they owe

        // User must have approved this contract to spend their DTC tokens
        dtc.transferFrom(msg.sender, address(this), dtcAmount * 1e18);
        dtc.burn(address(this), dtcAmount * 1e18); // Burn tokens from the contract's balance

        v.dtcDebt -= dtcAmount * 1e18; // Reduce user's dtcDebt
        emit Repaid(msg.sender, dtcAmount);
    }

    /**
     * @notice Calculates the current collateralization ratio for a user's vault.
     * @param user The address of the vault owner.
     * @return ratio The current collateralization ratio in percentage.
     */
    function getCollateralRatio(address user) public view returns (uint256 ratio) {
        Vault storage v = vaults[user];
        if (v.dtcDebt == 0) return type(uint256).max; // Infinite ratio if no debt

        uint256 btcPrice = oracle.getBTCPrice();
        require(btcPrice > 0, "BTC price cannot be zero from oracle");

        uint256 collateralUsd = (v.btcCollateral * btcPrice) / 1e8; // Convert BTC sats to USD (8 decimals)

        // Convert dtcDebt (1e18 wei) to USD (assuming 1 DTC = $1, scaled to 8 decimals for comparison)
        uint256 debtUsd = v.dtcDebt / 1e10; // 1e18 wei / 1e10 = 1e8 scaled USD

        require(debtUsd > 0, "Debt USD value for ratio calculation is zero");
        return (collateralUsd * 100) / debtUsd; // Ratio in percentage
    }

    /**
     * @notice Allows anyone to liquidate an undercollateralized vault.
     * The liquidator repays a portion of the vault's debt and is entitled to receive discounted collateral off-chain.
     * @param user The address of the vault owner to be liquidated.
     * @param dtcAmountToRepay The amount of DTC (in raw units, e.g., 10000) the liquidator repays.
     */
    function liquidate(address user, uint256 dtcAmountToRepay) external {
        require(user != address(0), "User address must not be zero");
        require(user != msg.sender, "Cannot liquidate your own vault");
        require(dtcAmountToRepay > 0, "Amount to repay must be > 0");

        Vault storage vault = vaults[user];
        require(vault.dtcDebt > 0, "Vault has no debt");

        // 1. Check if vault is undercollateralized
        uint256 currentCollateralRatio = getCollateralRatio(user);
        require(currentCollateralRatio < LIQUIDATION_RATIO, "Vault is not undercollateralized for liquidation");

        // 2. Determine actual amount to repay (cap at remaining debt)
        uint256 actualDtcAmountToRepayWei = dtcAmountToRepay * 1e18;
        if (actualDtcAmountToRepayWei > vault.dtcDebt) {
            actualDtcAmountToRepayWei = vault.dtcDebt;
            dtcAmountToRepay = actualDtcAmountToRepayWei / 1e18; // Update raw units for event
        }
        require(actualDtcAmountToRepayWei > 0, "Actual amount to repay became zero");

        // 3. Calculate collateral to be released to liquidator (with bounty)
        uint256 btcPrice = oracle.getBTCPrice();
        require(btcPrice > 0, "BTC price cannot be zero from oracle");

        // Convert repaid DTC value to USD with 8 decimals (1 DTC = $1)
        uint256 dtcRepaidUsdValue8Decimals = (actualDtcAmountToRepayWei / 1e18) * 1e8;

        // Apply liquidation bounty
        uint256 collateralUsdValueWithBounty8Decimals = (dtcRepaidUsdValue8Decimals * (100 + LIQUIDATION_BOUNTY_PERCENT)) / 100;

        // Convert USD value back to BTC satoshis
        uint256 collateralToLiquidate = (collateralUsdValueWithBounty8Decimals * 1e8) / btcPrice;
        require(collateralToLiquidate > 0, "Calculated collateral to liquidate is zero");

        // 4. Ensure enough collateral exists in the vault
        require(vault.btcCollateral >= collateralToLiquidate, "Insufficient collateral in vault for liquidation");

        // 5. Update vault's debt and collateral records on-chain
        vault.dtcDebt -= actualDtcAmountToRepayWei;
        vault.btcCollateral -= collateralToLiquidate;

        // 6. Transfer DTC from liquidator and burn it
        dtc.transferFrom(msg.sender, address(this), actualDtcAmountToRepayWei);
        dtc.burn(address(this), actualDtcAmountToRepayWei);

        // TODO: Crucial off-chain step: Signal backend to transfer actual BTC
        // (collateralToLiquidate amount) to the liquidator (msg.sender) from the treasury's Bitcoin multisig.

        // 7. Emit Event
        emit Liquidated(user, msg.sender, dtcAmountToRepay, collateralToLiquidate);
    }

    // Helper functions to get contract addresses
    function getDTCAddress() external view returns (address) {
        return address(dtc);
    }

    function getTreasuryAddress() external view returns (address) {
        return treasury;
    }
}