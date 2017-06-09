# solidity-playground

Contracts written in Solidity, using Truffle for deployment and testing. 

These are primarily for personal development. I have been using the decypher.tv tutorials for inspiration, implementing proposed contracts before watching their coresponding videos.

Note: I have intentionally included build files incase I want to check the generated ABI's. <code>npm install</code> is required in the root dir to get web3 if wanting to execute the 'ts.js' scripts.

<br><b>BasicEscrow</b> - Basic escrow contract written to understand the basics of Unit Testing with Truffle and to start learning Solidity. The file ts.js can be commented/uncommented and executed with 'exec ts.js' from the truffle console to play with a deployed Escrow contract. There are basic Unit tests written in Solidity and JS.

<br><b>CoinFlipper</b> - Random payout gambling contract. Two participants contribute the same amount of Ether and one of them gets it all sent to them. There are two contract implementations, one uses block hashes to determine the winner and one uses Oraclize. They both implement an abstract contract which has the same base functionality. I would like to know how to avoid using an abstract contract and use a library, perhaps that will come next.

The Web3Utils is copied from the BasicEscrow project and updated to be a bit more useful. The truffle.js includes a Rinkeby config as I used the Rinkeby testnet for testing the contract that requires Oraclize. I may experiment with ethereum-bridge to enable testing the Oraclize contract on testrpc. As before there is a ts.js which can be commented in parts and executed in the truffle console to play with the deployed contracts.

<br><b>Crowdsale</b> - Crowdsale contract where the creator is the beneficiary. Primarily written to understand events and how to test them. The test written to check the event firing doesn't pass consistently. I've asked around and tried to find a solution and will update it once I do. There is a 'ts.js' as before for manual testing purposes.
