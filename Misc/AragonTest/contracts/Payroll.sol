pragma solidity ^0.4.18;

//import "./PayrollInterface.sol";
// import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "./Ownable.sol";

// Leap years aren't considered in this setup. 
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
    uint256 public ethToUsd;
    
    event LogEmployeeAdded(address employeeAddress);
    
    modifier onlyOracle() { require(msg.sender == oracleAddress); _; }
    
    modifier isEmployee() { require(employees[msg.sender].yearlySalaryUsd > 0); _; }
    
    // modifier oneMonthSinceClaim() { require(employees[msg.sender].timeSalaryLastClaimed >))
    
    function Payroll(address initialOracleAddress) public {
        oracleAddress = initialOracleAddress;
    }
    
    function updateOracle(address newOracleAddress) public onlyOwner {
        oracleAddress = newOracleAddress;
    }
    
    // TODO: Enable use of multiple tokens.
    // function setExchangeRate(address token, uint256 usdExchangeRate) public onlyOracle {
    function setExchangeRate(uint256 usdExchangeRate) public onlyOracle {
        ethToUsd = usdExchangeRate;
    }

    function addEmployee(address employeeAddress, address[] allowedTokens, uint256 intialYearlySalaryUsd) public onlyOwner {
        Employee memory employee = Employee(allowedTokens, intialYearlySalaryUsd, 0);
        employees[employeeAddress] = employee;
        employeeCount++;
        LogEmployeeAdded(employeeAddress);
    }
    
    function setEmployeeSalary(address employeeAddress, uint256 yearlySalaryUsd) public onlyOwner {
        Employee storage employee = employees[employeeAddress];
        employee.yearlySalaryUsd = yearlySalaryUsd;
    }
    
    function removeEmployee(address employeeAddress) public onlyOwner {
        delete employees[employeeAddress];
        employeeCount--;
    }
    
    function addEther() public payable onlyOwner {
        // Throws if not the owner.
    }
    
    function escapeHatch() public onlyOwner {
        owner.transfer(this.balance);
    }
    
    function getEmployeeCount() public constant returns (uint256) {
        return employeeCount;
    }
    
    // TODO: Return more stuff
    function getEmployee(address employeeAddress) public view returns (address, uint256) {
        Employee storage employee = employees[employeeAddress];
        return (employeeAddress, employee.yearlySalaryUsd);
    }
    
    // TODO: Add / subtract to totalYearlySalariesUsd in add/set/remove employee functions
    function calculateMonthlyPayout() public view returns (uint256) {
        return totalYearlySalariesUsd / 12;
    }
    
    // Note this ignores leap years.
    function calculateDaysOfFundingAvailable() public view returns (uint256) {
        uint256 ethSpentPerDay = (totalYearlySalariesUsd / 365) * ethToUsd;
        uint256 daysOfFundingAvailable = this.balance / ethSpentPerDay;
        return daysOfFundingAvailable;
    }

    // TODO: Implement to allow receiver to specify their distribution of salary between available tokens
    // function specifyTokenAllocation(address[] tokens, uint256[] distribution) public {
        
    // }
    
    function payday() public isEmployee {
        
    }
}
