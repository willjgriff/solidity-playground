// 'use strict';
//
// const Example = artifacts.require('./LibraryV1.sol');
// const Example2 = artifacts.require('./LibraryV2.sol');
// const Dispatcher = artifacts.require('Dispatcher.sol');
// const DispatcherStorage = artifacts.require('DispatcherStorage.sol');
// const TheContract = artifacts.require('TheContract.sol');
//
// contract('TestProxyLibrary', () => {
//   describe('test', () => {
//     it('works', () => {
//       var thecontract, dispatcherStorage;
//       Example.new()
//         .then(example => DispatcherStorage.new(example.address))
//         .then(d => {
//           dispatcherStorage = d;
//           console.log("Dipatcher Binary TV1: " + Dispatcher.unlinked_binary)
//           Dispatcher.unlinked_binary = Dispatcher.unlinked_binary
//             .replace('1111222233334444555566667777888899990000',
//             dispatcherStorage.address.slice(2));
//           return Dispatcher.new();
//         })
//         .then(dispatcher => {
//           TheContract.link('LibraryInterface', dispatcher.address);
//           return TheContract.new();
//         })
//         .then(c => {
//           thecontract = c;
//           return thecontract.set(10);
//         })
//         .then(() => Example2.new())
//         .then(newExample => dispatcherStorage.updateLibraryAddress(newExample.address))
//         .then(() => thecontract.get())
//         .then(x => assert.equal(x.toNumber(), 10 * 10)); // Example 2 getter multiplies
//     });
//     // it.only('measure gas costs', () => {
//     // });
//   });
// });
