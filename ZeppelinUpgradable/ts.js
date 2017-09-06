const LibraryV2 = artifacts.require("LibraryV2.sol")
const Dispatcher = artifacts.require("Dispatcher.sol")
const DispatcherStorage = artifacts.require("DispatcherStorage.sol")
const TheContract = artifacts.require("TheContract.sol")

const dispatcher = Dispatcher.at(Dispatcher.address)
const dispatcherStorage = DispatcherStorage.at(DispatcherStorage.address)
const theContract = TheContract.at(TheContract.address)

const setAndDisplayContractVar = toNumber => theContract.set(toNumber)
    .then(tx => console.log(tx.receipt.logs))
    .then(() => theContract.get())
    .then(libraryVar => console.log("Lib var: " + libraryVar.toNumber()))

const updateLibrary = () => LibraryV2.new()
    .then(libraryV2 => dispatcherStorage.updateLibraryAddress(libraryV2.address))
    .then(() => console.log("Updated Library"))

const displayLibraryAddress = () => dispatcherStorage.libraryAddress()
    .then(libraryAddress => console.log("Library Address: " + libraryAddress))

// const logLibraryAddress = dispatcher.LogLibraryAddress()
// logLibraryAddress.watch((error, response) => {
// 	if (!error) {
// 		console.log("Library Address dispatched too: " + response.args.libraryAddress)
// 	} else {
// 		console.log(error)
// 	}
// 	logLibraryAddress.stopWatching()
// })

displayLibraryAddress()
    .then(() => setAndDisplayContractVar(11))
    // .then(() => updateLibrary())
    // .then(() => displayLibraryAddress())
    // .then(() => setAndDisplayContractVar(11))

module.exports = (callback) => {}