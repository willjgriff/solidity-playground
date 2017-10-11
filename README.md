# solidity-upgradable-contracts

<b>EtherRouter</b><br/>
Project experimenting with the <a href="https://github.com/ownage-ltd/ether-router">EtherRouter</a> package for creating upgradable contracts. Has very basic tests experimenting with upgrading a basic contract's functions with static and dynamic return types. Has helped me to fully understand the infamous delegate call and how storage is managed.

<b>ZeppelinUpgradable</b><br/>
Older investigation into upgradable contracts, copied from this article: https://blog.zeppelin.solutions/proxy-libraries-in-solidity-79fbe4b970fd and made more readable for my own understanding.

<b>FallbackStorageAccess</b><br/>
Test project demonstrating an issue with accessing contract storage in contracts linked as libraries. As expected, unfortunately we cannot access storage in a contract if the calling contract is linked to it as a library. 

When copying the ZeppelinUpgradable set of contracts, to begin with I overlooked the fact that libraries can't have storage so I misunderstood why we were hardcoding the `DispatcherStorage` address in the `Dispatcher`'s unlinked_binary during deployment. I made the FallbackStorageAccess project to understand the issue and realised my mistake. Subsequently, unit testing ZeppelinUpgradable (where we re-create the contract for each test) requires a bit of a hack as can be seen in the ZeppelinUpgradable `test/testClean.js`
