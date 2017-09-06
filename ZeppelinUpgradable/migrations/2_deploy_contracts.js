const LibraryV1 = artifacts.require("LibraryV1.sol")
const DispatcherStorage = artifacts.require("DispatcherStorage.sol")
const Dispatcher = artifacts.require("Dispatcher.sol")
const TheContract = artifacts.require("TheContract.sol")

module.exports = deployer => {
    // deployer.deploy(LibraryV1)
        // .then(() => deployer.deploy(DispatcherStorage, LibraryV1.address))
        // .then(() => {
        //     // TODO: Research a way of avoiding this, it's confusing and means we have to do
        //     // 'compile --all' before 'migrate --reset' because otherwise the DispatcherStorage address
        //     // will not be correctly set in the Dispatcher. It seems we can't access storage from the fallback
        //     // function so the DispatcherStorage address can't be set in the Dispatchers constructor.
        //     Dispatcher.unlinked_binary = Dispatcher.unlinked_binary
        //         .replace('1111222233334444555566667777888899990000', DispatcherStorage.address.slice(2))
        //     return deployer.deploy(Dispatcher, 43)
        // })
        // .then(() => {
        //     TheContract.link("LibraryInterface", Dispatcher.address)
        //     return deployer.deploy(TheContract)
        // })
}