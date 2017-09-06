const LibraryV1 = artifacts.require('LibraryV1.sol')
const LibraryV2 = artifacts.require('LibraryV2.sol')
const Dispatcher = artifacts.require('Dispatcher.sol')
const DispatcherStorage = artifacts.require('DispatcherStorage.sol')
const TheContract = artifacts.require('TheContract.sol')

// Note: Migrations of the Dispatcher should be disabled to enable these tests. Otherwise they will run and change the
// the hardcoded dispatcher storage address "1111222233334444555566667777888899990000" to something else preventing
// proper deployment of the below.
contract("TheContract", () => {

    let dispatcherStorage, theContract;
    let libraryVar = 10;
    let setGasCost = 48258;
    // Unfortunate hack required to update hardcoded dispatcher storage address before each test
    let currentDispatcherStorageAddress = "1111222233334444555566667777888899990000";

    // Deploy LibraryV1, then DispatcherStorage passing in LibraryV1's address,
    // then Dispatcher hardcoding the DispatcherStorage's address,
    // then TheContract after linking it to the Dispatcher as a library.
    beforeEach(() => {
        return LibraryV1.new()
            .then(libraryV1 => DispatcherStorage.new(libraryV1.address))
            .then(_dispatcherStorage => {
                dispatcherStorage = _dispatcherStorage
                const formattedDispatcherStorageAddress = dispatcherStorage.address.slice(2)

                Dispatcher.unlinked_binary = Dispatcher.unlinked_binary
                    .replace(currentDispatcherStorageAddress, formattedDispatcherStorageAddress)
                currentDispatcherStorageAddress = formattedDispatcherStorageAddress

                return Dispatcher.new()
            })
            .then(dispatcher => {
                TheContract.link("LibraryInterface", dispatcher.address)
                return TheContract.new()
            })
            .then(_theContract => theContract = _theContract)
    })

    describe("set() with LibraryV1", () => {

        it("updates library var correctly", () => {
            return theContract.set(libraryVar)
                .then(() => theContract.get())
                .then(_libraryVar => assert.equal(_libraryVar.toNumber(), libraryVar, "libraryVar was not updated correctly"))
        })

        it("gas cost is as expected", () => {
            return theContract.set(libraryVar)
                .then(tx => assert.equal(tx.receipt.gasUsed, setGasCost, "gas used was not as expected"))
        })
    })

    describe("set() with library updated to LibraryV2", () => {

        beforeEach(() => {
            return LibraryV2.new()
                .then(libraryV2 => dispatcherStorage.updateLibraryAddress(libraryV2.address))
        })

        it("updates library var correctly", () => {
            return theContract.set(libraryVar)
                .then(() => theContract.get())
                .then(_libraryVar => assert.equal(_libraryVar.toNumber(), libraryVar * 10, "libraryVar was not updated correctly"))
        })

        it("gas cost is as expected", () => {
            return theContract.set(libraryVar)
                .then(tx => assert.equal(tx.receipt.gasUsed, setGasCost, "gas used was not as expected"))
        })
    })

})
