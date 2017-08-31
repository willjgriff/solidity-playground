'use strict'

const LibraryV1 = artifacts.require('LibraryV1.sol')
const LibraryV2 = artifacts.require('LibraryV2.sol')
const Dispatcher = artifacts.require('Dispatcher.sol')
const DispatcherStorage = artifacts.require('DispatcherStorage.sol')
const TheContract = artifacts.require('TheContract.sol')

contract('TestProxyLibrary', () => {

    describe('library getUint()', () => {

        it('returns correct value when upgraded', () => {
            let theContract, dispatcherStorage

            LibraryV1.new()
                .then(libraryV1 => DispatcherStorage.new(libraryV1.address))
                .then(_dispatcherStorage => {
                    // TODO: Can the address be passed in the constructor...?
                    dispatcherStorage = _dispatcherStorage
                    Dispatcher.unlinked_binary = Dispatcher.unlinked_binary
                        .replace('1111222233334444555566667777888899990000', dispatcherStorage.address.slice(2))
                    return Dispatcher.new()
                })
                .then(dispatcher => {
                    TheContract.link('LibraryInterface', dispatcher.address)
                    return TheContract.new()
                })
                .then(_theContract => {
                    theContract = _theContract
                    return theContract.set(10)
                })
                .then(() => LibraryV2.new())
                .then(libraryV2 => dispatcherStorage.replace(libraryV2.address))
                .then(() => theContract.get())
                .then(x => assert.equal(x, 10 * 10)) // LibraryV2 getter multiplies
        })

        it.only('measure gas costs', () => {
        })
    })

})
