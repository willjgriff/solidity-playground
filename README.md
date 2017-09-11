# solidity-upgradable-contracts

<b>ZeppelinUpgradable</b><br/>
Copied from this article: https://blog.zeppelin.solutions/proxy-libraries-in-solidity-79fbe4b970fd and made more readable for my own understanding.

<b>FallbackStorageAccess</b><br/>
Test project demonstrating an issue with accessing contract storage in contracts linked as libraries. As expected, unfortunately we cannot access storage in a contract if the calling contract is linked to it as a library. 

When copying the ZeppelinUpgradable set of contracts, to begin with I overlooked the fact that libraries can't have storage so I misunderstood why we were hardcoding the `DispatcherStorage` address in the `Dispatcher`'s unlinked_binary during deployment. I made the FallbackStorageAccess project to understand the issue and realised the mistake. Subsequently to unit test ZeppelinUpgradable (where we re-create the contract for each test) requires a bit of a hack as can be seen in the ZeppelinUpgradable `test/testClean.js`

<b>ERC23</b><br/>
Note I should move this project or rename repo. Basic implementation of an ERC23 Token. I will extend this and add to the `StandardTokenReceiver` to expriment with computing and passing signatures around. 
