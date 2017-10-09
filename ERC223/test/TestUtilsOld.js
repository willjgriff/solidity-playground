// Used to assert if an error is thrown. Not sure why it was suggested to be used this way. Refer to TestUtils.js
// for the implementation I'm using. I will keep this in case I've missed something and need it in the future.
exports.TestUtils = class TestUtils {

    constructor(web3) {
        this.web3 = web3;
    }

    // Copied and edited from: https://gist.github.com/xavierlepretre/88682e871f4ad07be4534ae560692ee6
    getTransactionReceiptMined(txHash) {
        const receiptCheckInterval = 500; // milliseconds

        const transactionReceiptAsync = (resolve, reject) => {
            this.web3.eth.getTransactionReceipt(txHash, (error, receipt) => {
                console.log("In tx receipt async")
                if (receipt == null) {
                    setTimeout(() => transactionReceiptAsync(resolve, reject), receiptCheckInterval)
                } else if (error) {
                    reject(error)
                } else {
                    resolve(receipt)
                }
            })
        }

        return new Promise(transactionReceiptAsync)
    };

    // Copied and edited from: https://gist.github.com/xavierlepretre/d5583222fde52ddfbc58b7cfa0d2d0a9
    assertThrows(contractMethodCall, maxGasAvailable) {

        return new Promise((resolve, reject) => {
            try {
                resolve(contractMethodCall())
            } catch (error) {
                reject(error)
            }
        })
            .then(tx => {
                if (tx.receipt) {
                    console.log("Already got recetipt")
                    // Using testrpc so contract call returned whole tx not just tx hash and we can pass on the receipt.
                    return tx.receipt
                } else {
                    console.log("Executing getTranscationReceiptMined()")
                    // Using Ethereum network so we must wait for tx to be mined to get the receipt.
                    return this.getTransactionReceiptMined(tx)
                }
            })
            .then(txReceipt => {
                console.log("Assert called: " + txReceipt.gasUsed + " " + maxGasAvailable)
                assert.equal(txReceipt.gasUsed, maxGasAvailable, "tx successful, the max gas available was not consumed")
            })
            .catch(error => {
                if ((error + "").indexOf("invalid opcode") > -1 || (error + "").indexOf("out of gas") > -1) {
                    console.log("Error found in Testrpc tx")
                    // We are using TestRPC and tx has failed as expected. Catch and silence the error.
                } else if ((error + "").indexOf("please check your gas amount") > -1) {
                    console.log("Error found in Ethereum tx")
                    // We are using Ethereum network and tx has failed as expected. Catch and silence the error.
                } else {
                    console.log("Standard Error thrown")
                    // If the assertion fails then this relays the error it creates.
                    throw error
                }
            })
    }
}