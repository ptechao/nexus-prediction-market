// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./BinaryMarket.sol";

/**
 * @title CopyTradingVault
 * @dev A vault contract that allows users to deposit USDC and automatically follow the leader's trades
 * When the leader (vault owner) places bets on BinaryMarket, followers' funds are automatically allocated proportionally
 */
contract CopyTradingVault is Ownable, ReentrancyGuard {
    // ============ State Variables ============
    
    IERC20 public usdc;
    
    uint256 public vaultId;
    address public leader; // The vault owner who makes trading decisions
    string public leaderName;
    
    // Vault statistics
    uint256 public totalDeposited;
    uint256 public totalWithdrawn;
    uint256 public totalWinnings;
    
    // Follower tracking
    mapping(address => uint256) public followerDeposits;
    address[] public followers;
    mapping(address => bool) public isFollower;
    
    // Vault allocation tracking
    mapping(address => uint256) public marketYesAllocations;
    mapping(address => uint256) public marketNoAllocations;
    
    // ============ Events ============
    
    event DepositMade(
        address indexed follower,
        uint256 amount,
        uint256 timestamp
    );
    
    event WithdrawalMade(
        address indexed follower,
        uint256 amount,
        uint256 timestamp
    );
    
    event LeaderBet(
        address indexed market,
        bool isYes,
        uint256 leaderAmount,
        uint256 totalFollowerAmount,
        uint256 timestamp
    );
    
    event WinningsClaimed(
        address indexed follower,
        uint256 amount,
        uint256 timestamp
    );
    
    // ============ Constructor ============
    
    constructor(
        address _usdc,
        uint256 _vaultId,
        string memory _leaderName
    ) {
        require(_usdc != address(0), "Invalid USDC address");
        
        usdc = IERC20(_usdc);
        vaultId = _vaultId;
        leader = msg.sender;
        leaderName = _leaderName;
    }
    
    // ============ Follower Functions ============
    
    /**
     * @dev Deposit USDC into the vault to follow the leader
     * @param amount Amount of USDC to deposit
     */
    function deposit(uint256 amount) external nonReentrant {
        require(amount > 0, "Deposit amount must be greater than 0");
        
        // Transfer USDC from follower to vault
        require(
            usdc.transferFrom(msg.sender, address(this), amount),
            "USDC transfer failed"
        );
        
        // Track new follower
        if (!isFollower[msg.sender]) {
            followers.push(msg.sender);
            isFollower[msg.sender] = true;
        }
        
        followerDeposits[msg.sender] += amount;
        totalDeposited += amount;
        
        emit DepositMade(msg.sender, amount, block.timestamp);
    }
    
    /**
     * @dev Withdraw USDC from the vault
     * @param amount Amount of USDC to withdraw
     */
    function withdraw(uint256 amount) external nonReentrant {
        require(amount > 0, "Withdrawal amount must be greater than 0");
        require(followerDeposits[msg.sender] >= amount, "Insufficient balance");
        
        followerDeposits[msg.sender] -= amount;
        totalWithdrawn += amount;
        
        require(usdc.transfer(msg.sender, amount), "USDC transfer failed");
        
        emit WithdrawalMade(msg.sender, amount, block.timestamp);
    }
    
    /**
     * @dev Get follower's current balance
     */
    function getFollowerBalance(address follower) external view returns (uint256) {
        return followerDeposits[follower];
    }
    
    /**
     * @dev Get total number of followers
     */
    function getFollowerCount() external view returns (uint256) {
        return followers.length;
    }
    
    /**
     * @dev Get follower at index
     */
    function getFollowerAt(uint256 index) external view returns (address) {
        require(index < followers.length, "Index out of bounds");
        return followers[index];
    }
    
    // ============ Leader Functions ============
    
    /**
     * @dev Leader places a YES bet and followers' funds are allocated proportionally
     * @param market Address of the BinaryMarket contract
     * @param leaderAmount Amount the leader wants to bet
     */
    function leaderBuyYes(address market, uint256 leaderAmount) external onlyOwner nonReentrant {
        require(market != address(0), "Invalid market address");
        require(leaderAmount > 0, "Bet amount must be greater than 0");
        
        BinaryMarket binaryMarket = BinaryMarket(market);
        
        // Calculate total follower funds available
        uint256 totalFollowerFunds = 0;
        for (uint256 i = 0; i < followers.length; i++) {
            totalFollowerFunds += followerDeposits[followers[i]];
        }
        
        // Leader places their own bet
        require(usdc.approve(market, leaderAmount), "Approval failed");
        binaryMarket.buyYes(leaderAmount);
        
        // Allocate follower funds proportionally
        if (totalFollowerFunds > 0) {
            for (uint256 i = 0; i < followers.length; i++) {
                address follower = followers[i];
                uint256 followerShare = (followerDeposits[follower] * leaderAmount) / totalFollowerFunds;
                
                if (followerShare > 0) {
                    require(usdc.approve(market, followerShare), "Approval failed");
                    binaryMarket.buyYes(followerShare);
                    marketYesAllocations[follower] += followerShare;
                }
            }
        }
        
        emit LeaderBet(market, true, leaderAmount, totalFollowerFunds, block.timestamp);
    }
    
    /**
     * @dev Leader places a NO bet and followers' funds are allocated proportionally
     * @param market Address of the BinaryMarket contract
     * @param leaderAmount Amount the leader wants to bet
     */
    function leaderBuyNo(address market, uint256 leaderAmount) external onlyOwner nonReentrant {
        require(market != address(0), "Invalid market address");
        require(leaderAmount > 0, "Bet amount must be greater than 0");
        
        BinaryMarket binaryMarket = BinaryMarket(market);
        
        // Calculate total follower funds available
        uint256 totalFollowerFunds = 0;
        for (uint256 i = 0; i < followers.length; i++) {
            totalFollowerFunds += followerDeposits[followers[i]];
        }
        
        // Leader places their own bet
        require(usdc.approve(market, leaderAmount), "Approval failed");
        binaryMarket.buyNo(leaderAmount);
        
        // Allocate follower funds proportionally
        if (totalFollowerFunds > 0) {
            for (uint256 i = 0; i < followers.length; i++) {
                address follower = followers[i];
                uint256 followerShare = (followerDeposits[follower] * leaderAmount) / totalFollowerFunds;
                
                if (followerShare > 0) {
                    require(usdc.approve(market, followerShare), "Approval failed");
                    binaryMarket.buyNo(followerShare);
                    marketNoAllocations[follower] += followerShare;
                }
            }
        }
        
        emit LeaderBet(market, false, leaderAmount, totalFollowerFunds, block.timestamp);
    }
    
    // ============ View Functions ============
    
    /**
     * @dev Get vault statistics
     */
    function getVaultStats() external view returns (
        uint256 totalDeposits,
        uint256 totalWithdrawals,
        uint256 followerCount,
        uint256 totalFundsManaged
    ) {
        uint256 totalFunds = 0;
        for (uint256 i = 0; i < followers.length; i++) {
            totalFunds += followerDeposits[followers[i]];
        }
        
        return (totalDeposited, totalWithdrawn, followers.length, totalFunds);
    }
    
    /**
     * @dev Get leader information
     */
    function getLeaderInfo() external view returns (
        address leaderAddress,
        string memory name,
        uint256 vaultIdNumber
    ) {
        return (leader, leaderName, vaultId);
    }
}
