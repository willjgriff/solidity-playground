# solidity-upgradable-contracts

<b>ZeppelinUpgradable</b><br/>
Copied from this article: https://blog.zeppelin.solutions/proxy-libraries-in-solidity-79fbe4b970fd and made more readable for my own understanding.

<b>FallbackStorageAccess</b><br/>
Test project demonstrating an issue with accessing contract storage in contracts linked as libraries. As expected, unfortunately we cannot access storage in a contract if the calling contract is linked to it as a library. 

The result of the FallbackStorageAccess test is that in ZeppelinUpgradable we must hardcode the DispatcherStorage address in the Dispatcher by editing the Dispatchers unlinked_binary in the compiled contract. To unit test usage of the Dispatcher (where we re-create the contract for each test) requires a bit of a hack as can be seen in the ZeppelinUpgradable `test/testClean.js`
