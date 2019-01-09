# solidity-playground

Contracts written in Solidity, using Truffle for deployment and testing. 

See the individual folders Readme's for details regarding the contracts within.

These are primarily for personal development, in order of when I wrote them (the first one's described in each of the lists/folders are the oldest). I started by using the decypher.tv tutorials for inspiration. I then moved on to building larger sets of contracts which can be seen in Tokens, Governance, Upgradable, EIPs/ERCs and Misc.

### DecypherTv:
- Basic Escrow
- Coin Flipper (uses Oraclize)
- Crowdsale

### Tokens:
- Youtube Token (uses Oraclize)
- MiniMe Testing
- ERC 223

### Governance:
- Basic Vote
- Futarchy (SchellingVote)
- Liquid Lockable Vote
- Liquid Democracy (WIP)

### Upgradable:
- Fallback Storage Access Test
- Zeppelin Upgradable Proxy
- Ether Router
- Byzantium Upgradable

### EIPs/ERCs
- EIP 712 (Structured data signing)
- EIP 165 (Contract interface detection)

## Misc:
- Ipfs Experiment 
- Zeppelin Ethernaut
- Assembly Experiments
- Aragon Test
- Meta Transactions

More recent Truffle projects have JS tests for demonstrating functionality, older projects use JS scripts executed directly through the Truffle console.

Note: <code>npm install</code> is required in some projects eg for Zeppelin Contracts.
