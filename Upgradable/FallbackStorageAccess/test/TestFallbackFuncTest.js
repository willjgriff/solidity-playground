const FallbackFuncContract = artifacts.require("FallbackFuncContract.sol")
const FallbackContractDelegate = artifacts.require("FallbackContractDelegate.sol")
const FallbackLibraryDelegate = artifacts.require("FallbackLibraryDelegate.sol")
let testInt = 43;

contract("FallbackFuncContract", accounts => {

    let fallbackFuncContract

    beforeEach(() => {
        return FallbackFuncContract.new(testInt)
            .then(_fallbackFuncContract => fallbackFuncContract = _fallbackFuncContract)
    })

    describe("someNumber()", () => {

        it("returns expected int", () => {
            return fallbackFuncContract.someNumber()
                .then(someNumber => assert.equal(someNumber.toNumber(), testInt, "Numbers are not equal"))
        })

    })

    describe("fallback function", () => {

        it("changes someNumber correctly", () => {
            // sendTransaction() prompts calling of fallback function
            return fallbackFuncContract.sendTransaction()
                .then(() => fallbackFuncContract.someNumber())
                .then(someNumber => assert.equal(someNumber.toNumber(), testInt + 5, "someNumber not updated correctly"))
        })
    })

})

contract("FallbackContractDelegate", accounts => {

    let fallbackFuncContract, fallbackContractDelegate

    beforeEach(() => {
        return FallbackFuncContract.new(testInt)
            .then(_fallbackFuncContract => {
                fallbackFuncContract = _fallbackFuncContract
                return FallbackContractDelegate.new(fallbackFuncContract.address)
            })
            .then(_fallbackContractDelegate => fallbackContractDelegate = _fallbackContractDelegate)
    })

    describe("callFallbackContract()", () => {

        it("updates someNumber in fallbackFuncContract correctly", () => {
            return fallbackContractDelegate.callFallbackContract()
                .then(() => fallbackFuncContract.someNumber())
                .then(someNumber => assert.equal(someNumber.toNumber(), testInt + 5, "someNumber in FallbackFuncContract not updated correctly"))
        })
    })
})

// Notice this test fails. We cannot update or access someNumber in the FallbackFuncContract as it is referred to as a library.
// Libraries are treated basically as if their code is copied into the calling contract so can't have access to variables in it's own contract.
contract("FallbackLibraryDelegate", () => {

    let fallbackFuncContract, fallbackLibraryDelegate

    beforeEach(() => {
        return FallbackFuncContract.new(testInt)
            .then(_fallbackFuncContract => {
                fallbackFuncContract = _fallbackFuncContract
                FallbackLibraryDelegate.link("FallbackFuncInterface", FallbackFuncContract.address)
                return FallbackLibraryDelegate.new()
            })
            .then(_fallbackLibraryDelegate => fallbackLibraryDelegate = _fallbackLibraryDelegate)
    })

    describe("callFallbackContract()", () => {

        it("updates someNumber in fallbackFuncContract correctly", () => {
            return fallbackLibraryDelegate.callFallbackContract()
                .then(() => fallbackFuncContract.someNumber())
                .then(someNumber => assert.equal(someNumber.toNumber(), testInt + 5, "someNumber in FallbackFuncContract not updated correctly"))
        })
    })

})
