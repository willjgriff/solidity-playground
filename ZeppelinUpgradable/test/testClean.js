'use strict'

const LibraryV1 = artifacts.require('LibraryV1.sol')
const LibraryV2 = artifacts.require('LibraryV2.sol')
const Dispatcher = artifacts.require('Dispatcher.sol')
const DispatcherStorage = artifacts.require('DispatcherStorage.sol')
const TheContract = artifacts.require('TheContract.sol')

contract('TestProxyLibrary', () => {

    let dispatcher, theContract;

    beforeEach(() => {
        return LibraryV1.new()
            .then(libraryV1 => DispatcherStorage.new(libraryV1.address))
            .then(dispatcherStorage => {
                Dispatcher.unlinked_binary = Dispatcher.unlinked_binary
                    .replace('1111222233334444555566667777888899990000', dispatcherStorage.address.slice(2))
                return Dispatcher.new()
            })
            .then(_dispatcher => {
                dispatcher = _dispatcher
                TheContract.link("LibraryInterface", dispatcher.address)
                return TheContract.new()
            })
            .then(_theContract => theContract = _theContract)
    })

    describe("dispatcher fallback function", () => {

        it("updates someNumber correctly", () => {
            return theContract.set(10)
                .then(() => dispatcher.someNumber())
                .then(someNumber => assert.equal(someNumber.toNumber(), 43, "someNumber was not set"))
        })
    })

    // describe('library getUint()', () => {
    //
    //     it('returns correct value when upgraded', () => {
    //         let theContract, dispatcherStorage
    //
    //         LibraryV1.new()
    //             .then(libraryV1 => DispatcherStorage.new(libraryV1.address))
    //             .then(_dispatcherStorage => {
    //                 dispatcherStorage = _dispatcherStorage
    //                 Dispatcher.unlinked_binary = Dispatcher.unlinked_binary
    //                     .replace('1111222233334444555566667777888899990000', dispatcherStorage.address.slice(2))
    //                 return Dispatcher.new()
    //             })
    //             .then(dispatcher => {
    //                 TheContract.link('LibraryInterface', dispatcher.address)
    //                 return TheContract.new()
    //             })
    //             .then(_theContract => {
    //                 theContract = _theContract
    //                 return theContract.set(10)
    //             })
    //             .then(() => LibraryV2.new())
    //             .then(libraryV2 => dispatcherStorage.replace(libraryV2.address))
    //             .then(() => theContract.get())
    //             .then(x => assert.equal(x, 10 * 10)) // LibraryV2 getter multiplies
    //     })
    //
    //     it.only('measure gas costs', () => {
    //     })
    // })

})
