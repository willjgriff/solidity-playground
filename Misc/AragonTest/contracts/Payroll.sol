pragma solidity ^0.4.18;

//import "./PayrollInterface.sol";

contract Payroll {

    struct Employee {
        address receiverAddress;
        address[] allowedTokens;
    }

    uint256 public employeeCount;
    mapping (uint256 => Employee) public employees;

    function addEmployee(address employeeAddress, address[] allowedTokens, uint256 initialYearlyUSDSalary) public {
        Employee employee = Employee(employeeAddress, allowedTokens);
    }

}
