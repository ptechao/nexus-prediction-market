// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title BinaryMarket
 * @dev A simple binary (Yes/No) prediction market contract
 * Users can bet on Yes or No outcomes, and the market owner can resolve the outcome
 */
contract BinaryMarket is Ownable, ReentrancyGuard {
    // ============ State Variables ============
    
    IERC20 public usdc;
    
    uint256 public marketId;
    string public eventTitle;
    uint256 public endTime;
    
    enum MarketStatus { OPEN, RESOLVED, CANCELLED }
    MarketStatus public status;
    
    enum Outcome { UNRESOLVED, YES, NO }
    Outcome public resolvedOutcome;
    
    // Total amount bet on each outcome
    uint256 public yesPoolAmount;
    uint256 public noPoolAmount;
    
    // Mapping of user address to their bets
    mapping(address => uint256) public yesBets;
    mapping(address => uint256) public noBets;
    mapping(address => bool) public hasClaimed;
    
    // ============ Events ============
    
    event BetPlaced(
        address indexed bettor,
        bool isYes,
        uint256 amount,
        uint256 timestamp
    );
    
    event MarketResolved(
        Outcome outcome,
        uint256 timestamp
    );
    
    event WinningsClaimed(
        address indexed winner,
        uint256 amount,
        uint256 timestamp
    );
    
    event MarketCancelled(uint256 timestamp);
    
    // ============ Constructor ============
    
    constructor(
        address _usdc,
        uint256 _marketId,
        string memory _eventTitle,
        uint256 _endTime
    ) {
        require(_usdc != address(0), "Invalid USDC address");
        require(_endTime > block.timestamp, "End time must be in the future");
        
        usdc = IERC20(_usdc);
        marketId = _marketId;
        eventTitle = _eventTitle;
        endTime = _endTime;
        status = MarketStatus.OPEN;
        resolvedOutcome = Outcome.UNRESOLVED;
    }
    
    // ============ Core Functions ============
    
    /**
     * @dev Place a bet on YES outcome
     * @param amount Amount of USDC to bet
     */
    function buyYes(uint256 amount) external nonReentrant {
        require(status == MarketStatus.OPEN, "Market is not open");
        require(block.timestamp < endTime, "Market has ended");
        require(amount > 0, "Bet amount must be greater than 0");
        
        // Transfer USDC from user to contract
        require(
            usdc.transferFrom(msg.sender, address(this), amount),
            "USDC transfer failed"
        );
        
        yesBets[msg.sender] += amount;
        yesPoolAmount += amount;
        
        emit BetPlaced(msg.sender, true, amount, block.timestamp);
    }
    
    /**
     * @dev Place a bet on NO outcome
     * @param amount Amount of USDC to bet
     */
    function buyNo(uint256 amount) external nonReentrant {
        require(status == MarketStatus.OPEN, "Market is not open");
        require(block.timestamp < endTime, "Market has ended");
        require(amount > 0, "Bet amount must be greater than 0");
        
        // Transfer USDC from user to contract
        require(
            usdc.transferFrom(msg.sender, address(this), amount),
            "USDC transfer failed"
        );
        
        noBets[msg.sender] += amount;
        noPoolAmount += amount;
        
        emit BetPlaced(msg.sender, false, amount, block.timestamp);
    }
    
    /**
     * @dev Claim winnings after market is resolved
     */
    function claimWinnings() external nonReentrant {
        require(status == MarketStatus.RESOLVED, "Market is not resolved");
        require(!hasClaimed[msg.sender], "Already claimed winnings");
        
        uint256 winnings = 0;
        
        if (resolvedOutcome == Outcome.YES) {
            require(yesBets[msg.sender] > 0, "No YES bets to claim");
            
            // Calculate proportional share of total pool
            uint256 totalPool = yesPoolAmount + noPoolAmount;
            winnings = (yesBets[msg.sender] * totalPool) / yesPoolAmount;
        } else if (resolvedOutcome == Outcome.NO) {
            require(noBets[msg.sender] > 0, "No NO bets to claim");
            
            // Calculate proportional share of total pool
            uint256 totalPool = yesPoolAmount + noPoolAmount;
            winnings = (noBets[msg.sender] * totalPool) / noPoolAmount;
        } else {
            revert("Market outcome is unresolved");
        }
        
        hasClaimed[msg.sender] = true;
        
        require(usdc.transfer(msg.sender, winnings), "USDC transfer failed");
        
        emit WinningsClaimed(msg.sender, winnings, block.timestamp);
    }
    
    // ============ Admin Functions ============
    
    /**
     * @dev Simple oracle resolution function (admin-controlled for MVP)
     * In production, this would be replaced with UMA or Chainlink oracle
     * @param outcome The resolved outcome (1 for YES, 2 for NO)
     */
    function adminResolve(uint256 outcome) external onlyOwner nonReentrant {
        require(status == MarketStatus.OPEN, "Market already resolved");
        require(outcome == 1 || outcome == 2, "Invalid outcome");
        require(block.timestamp >= endTime, "Market has not ended");
        
        status = MarketStatus.RESOLVED;
        resolvedOutcome = outcome == 1 ? Outcome.YES : Outcome.NO;
        
        emit MarketResolved(resolvedOutcome, block.timestamp);
    }
    
    /**
     * @dev Cancel the market and refund all bets
     */
    function cancelMarket() external onlyOwner {
        require(status == MarketStatus.OPEN, "Market already resolved");
        
        status = MarketStatus.CANCELLED;
        
        emit MarketCancelled(block.timestamp);
    }
    
    // ============ View Functions ============
    
    /**
     * @dev Get current odds for YES outcome (as percentage 0-100)
     */
    function getYesOdds() external view returns (uint256) {
        uint256 totalPool = yesPoolAmount + noPoolAmount;
        if (totalPool == 0) return 50; // Default 50/50 if no bets
        return (yesPoolAmount * 100) / totalPool;
    }
    
    /**
     * @dev Get current odds for NO outcome (as percentage 0-100)
     */
    function getNoOdds() external view returns (uint256) {
        uint256 totalPool = yesPoolAmount + noPoolAmount;
        if (totalPool == 0) return 50; // Default 50/50 if no bets
        return (noPoolAmount * 100) / totalPool;
    }
    
    /**
     * @dev Get total pool size
     */
    function getTotalPool() external view returns (uint256) {
        return yesPoolAmount + noPoolAmount;
    }
    
    /**
     * @dev Get user's bet amounts
     */
    function getUserBets(address user) external view returns (uint256 yesBet, uint256 noBet) {
        return (yesBets[user], noBets[user]);
    }
    
    /**
     * @dev Get market status
     */
    function getMarketStatus() external view returns (string memory) {
        if (status == MarketStatus.OPEN) return "OPEN";
        if (status == MarketStatus.RESOLVED) return "RESOLVED";
        return "CANCELLED";
    }
}
