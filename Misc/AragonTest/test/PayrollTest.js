const Payroll = artifacts.require("Payroll.sol")

contract("Payroll", accounts => {

    let payroll
    let oracleAddress = accounts[0]

    beforeEach(async () => payroll = await Payroll.new(oracleAddress))

    describe("Payroll()", () => {

        it("sets correct oracle address", async () => {
            const actualOracleAddress = await payroll.oracleAddress()
            assert.equal(actualOracleAddress, oracleAddress)
        })
    })

    describe("updateOracle(address newOracleAddress)", () => {

        it("sets new oracle address", async () => {
            const newOracleAddress = accounts[1]
            await payroll.updateOracle(newOracleAddress)
            const actualOracleAddress = await payroll.oracleAddress()
            assert.equal(actualOracleAddress, newOracleAddress)
        })
    })

    describe("setExchangeRate(uint256 useToEth)", () => {

        it("converts usdToEth exchange rate to weiToUsd exchange rate", async () => {
            const usdToEth = 400
            const usdTokenToEth = usdToEth * (10 ** 18) // multiplier to convert Usd to microUsd
            const usdTokenToWei = usdTokenToEth / (10 ** 18) // multiplier to convert Eth to Wei

            await payroll.setExchangeRate(usdToEth)
            const actualWeiToUsd = await payroll.usdTokenToWei()
            assert.equal(actualWeiToUsd.toNumber(), usdTokenToWei)
        })
    })

    describe("addEmployee(address employeeAddress, address[] allowedTokens, uint256 initialYearlySalaryUsd)", () => {

        it("adds an employee to mapping with correct details", async () => {
            const yearlySalaryUsd = 30000
            const yearlySalaryUsdToken = yearlySalaryUsd * (10 ** 18)
            const employeeAddress = accounts[1]

            await payroll.addEmployee(employeeAddress, [], yearlySalaryUsd)
            const employeeDetails = await payroll.employees(employeeAddress)

            assert.equal(employeeDetails[0].toNumber(), yearlySalaryUsdToken, "Employee salary is incorrect")
            assert.closeTo(employeeDetails[1].toNumber(), Date.now()/1000, 2, "Employee initial claim time is incorrect")
        })

        it("increases employee count", async () => {
            await payroll.addEmployee(accounts[1], [], 30000)
            const actualEmployeeCount = await payroll.employeeCount()

            assert.equal(actualEmployeeCount, 1)
        })
    })

    describe("setEmployeeSalary(address employeeAddress, uint256 yearlySalaryUsd)", () => {

        it("updates the employees salary", async () => {
            const employeeAddress = accounts[1]
            const expectedEmployeeSalary = 35000
            await payroll.addEmployee(employeeAddress, [], 30000)

            await payroll.setEmployeeSalary(employeeAddress, expectedEmployeeSalary)
            const actualEmployeeSalary = (await payroll.employees(employeeAddress))[0]

            assert.equal(actualEmployeeSalary, expectedEmployeeSalary)
        })
    })

    describe("removeEmployee(address employeeAddress)", () => {

        it("deletes employee data from mapping", async () => {
            const employeeAddress = accounts[1]
            await payroll.addEmployee(employeeAddress, [], 30000)
            await payroll.removeEmployee(employeeAddress)
            const deletedEmployee = await payroll.employees(employeeAddress)

            assert.equal(deletedEmployee[0].toNumber(), 0)
            assert.equal(deletedEmployee[1].toNumber(), 0)
        })
    })

    describe("sendEther()", () => {

        it("allows sending of Ether", async () => {
            const expectedBalanceWei = web3.toWei(10, "ether")
            await payroll.sendEther({ value: expectedBalanceWei })
            const actualBalanceWei = await web3.eth.getBalance(payroll.address)

            assert.equal(actualBalanceWei, expectedBalanceWei)
        })
    })

    describe("calculateMonthlyPayoutUsd()", () => {

        it("correctly calculates monthly payout", async () => {
            const employeeSalary1 = 30000
            const employeeSalary2 = 40000
            const expectedMonthlyPayout = (employeeSalary1 + employeeSalary2) / 12
            const wholeExpectedMonthlyPayout = Math.round(expectedMonthlyPayout)
            await payroll.addEmployee(accounts[1], [], employeeSalary1)
            await payroll.addEmployee(accounts[2], [], employeeSalary2)

            const actualMonthlyPayout = await payroll.calculateMonthlyPayoutUsd()

            assert.equal(actualMonthlyPayout.toNumber(), wholeExpectedMonthlyPayout)
        })
    })

    describe("calculateDaysOfFundingAvailable()", () => {

        it("correctly calculates days of funding available", async () => {
            const etherBalance = 10
            const weiBalance = web3.toWei(etherBalance, 'ether')
            await payroll.sendEther( {value: weiBalance })

            const employeeSalaryUsd = 30000
            const employeeSalaryUsdToken = employeeSalaryUsd * (10 ** 18)
            const dailyCostUsdToken = employeeSalaryUsdToken / 365
            await payroll.addEmployee(accounts[1], [], employeeSalaryUsd)

            const usdTokenToWei = 400
            const dailyCostWei = dailyCostUsdToken / usdTokenToWei
            await payroll.setExchangeRate(usdTokenToWei)

            const expectedDaysAvailable =  weiBalance / dailyCostWei
            const expectedDaysAvailableFloor = Math.floor(expectedDaysAvailable)

            const actualDaysAvailable = await payroll.calculateDaysOfFundingAvailable()

            assert.equal(actualDaysAvailable, expectedDaysAvailableFloor)
        })
    })

    describe("payday()", () => {

        it("pays employee correctly", async () => {

        })
    })
})
