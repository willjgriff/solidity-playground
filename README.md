# solidity-playground

Contracts written in Solidity, using Truffle for deployment and testing. 

See individual folders Readme's for details regarding the contracts within.

These are primarily for personal development, in order of when I wrote them (the first one's in the lists are the most recent and best representation of my understanding of Solidity). 

I started by using the decypher.tv tutorials for inspiration. I then moved on to building larger sets of contracts which can be seen in Governance and MiscExperiments. 

More recent Truffle projects have JS tests for demonstrating functionality, older projects use JS scripts executed directly through the Truffle console.

Note: <code>npm install</code> is required in some projects.


More recent experiments with Solidity than those in solidity-playground.

<b>ERC223</b><br/>
Basic implementation of the current ERC223 token proposal with minimal tests for experimentation. Largely copied from Aragon's implementation here: https://github.com/aragon/ERC23. Demonstrates how to call functions using byte/hex encoded function calls.

<b>MiniMeTesting</b><br/>
Playing with the Giveth MiniMeToken from https://github.com/Giveth/minime with some basic tests to understand its functionality.
