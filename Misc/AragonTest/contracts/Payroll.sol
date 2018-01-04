pragma solidity ^0.4.18;

//import "./PayrollInterface.sol";
// import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "./Ownable.sol";

// Leap years aren't considered in this setup.
// TODO: Extract constants!
contract Payroll is Ownable {

    struct Employee {
        address[] allowedTokens;
        uint256 yearlySalaryUsd;
        uint256 timeSalaryLastClaimed;
    }
    
    address public oracleAddress;
    uint256 public employeeCount;
    mapping (address => Employee) public employees;
    uint256 private totalYearlySalariesUsd;
    uint256 public usdTokenToWei;
    
    event LogEmployeeAdded(address employeeAddress);
    
    modifier onlyOracle() { require(msg.sender == oracleAddress); _; }
    
    modifier isEmployee(address employeeAddress) { require(employees[employeeAddress].yearlySalaryUsd > 0); _; }
    
    function Payroll(address initialOracleAddress) public {
        oracleAddress = initialOracleAddress;
    }
    
    function updateOracle(address newOracleAddress) public onlyOwner {
        oracleAddress = newOracleAddress;
    }
    
    // TODO: Enable use of multiple tokens.
    // function setExchangeRate(address token, uint256 usdExchangeRate) public onlyOracle {
    function setExchangeRate(uint256 usdToEth) public onlyOracle {
//        uint256 usdWeiToEth = usdToEth * (10 ** 18);
//        uint256 usdWeiToWei = usdTokenToEth / (10 ** 18);
        usdTokenToWei = usdToEth;
    }

    function addEmployee(address employeeAddress, address[] allowedTokens, uint256 initialYearlySalaryUsd) public onlyOwner {
        uint256 yearlySalaryUsdToken = initialYearlySalaryUsd * (10 ** 18);
        Employee memory employee = Employee(allowedTokens, yearlySalaryUsdToken, now);
        employees[employeeAddress] = employee;

        employeeCount++;
        totalYearlySalariesUsd += initialYearlySalaryUsd;

        LogEmployeeAdded(employeeAddress);
    }
    
    function setEmployeeSalary(address employeeAddress, uint256 yearlySalaryUsd) public onlyOwner isEmployee(employeeAddress) {
        Employee storage employee = employees[employeeAddress];

        totalYearlySalariesUsd -= employee.yearlySalaryUsd;
        totalYearlySalariesUsd += yearlySalaryUsd;

        employee.yearlySalaryUsd = yearlySalaryUsd;
    }
    
    function removeEmployee(address employeeAddress) public onlyOwner isEmployee(employeeAddress) {
        totalYearlySalariesUsd -= employees[employeeAddress].yearlySalaryUsd;

        delete employees[employeeAddress];
        employeeCount--;
    }

    function sendEther() public payable onlyOwner {
        // Throws if not the owner.
    }
    
    function escapeHatch() public onlyOwner {
        owner.transfer(this.balance);
    }
    
    function calculateMonthlyPayoutUsd() public view returns (uint256) {
        return totalYearlySalariesUsd / 12;
    }

    // This doesn't account for leap years or monthly payouts that are currently unclaimed.
    function calculateDaysOfFundingAvailable() public view returns (uint256) {
        uint256 totalSalariesUsdToken = totalYearlySalariesUsd * (10 ** 18);
        uint256 dailyCostUsdToken = totalSalariesUsdToken / 365;
        uint256 dailyCostWei = dailyCostUsdToken / usdTokenToWei;
        uint256 daysAvailable = this.balance / dailyCostWei;

        return daysAvailable;
    }

    // TODO: Implement to allow receiver to specify their distribution of salary between available tokens
    // function specifyTokenAllocation(address[] tokens, uint256[] distribution) public {
        
    // }

    // Employee can claim a payment one month after being added
    function payday() public isEmployee(msg.sender) {
        Employee storage employee = employees[msg.sender];
        uint nextClaimTime = employee.timeSalaryLastClaimed + 730 hours; // 730 hours in a month.
        require(now > nextClaimTime);
        
        uint monthlyPayment = employee.yearlySalaryUsd / 12 * usdTokenToWei;
        msg.sender.transfer(monthlyPayment);
        employee.timeSalaryLastClaimed = nextClaimTime;
    }
}
