// This has been tested with the real Ethereum network and Testrpc.
// Copied and edited from: https://gist.github.com/xavierlepretre/d5583222fde52ddfbc58b7cfa0d2d0a9

const assertThrows = (contractMethodCall, maxGasAvailable) =>
    assertThrowsMessage(contractMethodCall, maxGasAvailable, "Tx successful, the max gas available was not consumed")

const assertThrowsMessage = (contractMethodCall, maxGasAvailable, assertMessage) => {
    return new Promise((resolve, reject) => {
        try {
            resolve(contractMethodCall())
        } catch (error) {
            reject(error)
        }
    })
        .then(tx => {
            assert.equal(tx.receipt.gasUsed, maxGasAvailable, assertMessage)
        })
        .catch(error => {
            if ((error + "").indexOf("invalid opcode") < 0 && (error + "").indexOf("out of gas") < 0) {
                // Checks if the error is from TestRpc. If it is then ignore it.
                // Otherwise relay/throw the error produced by the above assertion.
                // Note that no error is thrown when using a real Ethereum network AND the assertion above is true.
                throw error
            }
        })
}

const assertThrowsSinceByzantium = (contractMethodCall) => {
    return new Promise((resolve, reject) => {
        try {
            resolve(contractMethodCall())
        } catch (error) {
            reject(error)
        }
    })
        .then(transaction => {
            // This asserts the mined transaction has failed, this occurs on live chains
            // or when a transaction is successful on testrpc.
            assert.equal(transaction.receipt.status, 0, "Transaction successful, test fails")
        })
        .catch(error => {
            // On testrpc a failed transaction is not mined but creates an error instead.
            // This checks for the term "revert" in the error and ignores it if it contains
            // it, declaring the test successful. It will throw any other errors.
            if ((error + "").indexOf("revert") < 0) {
                throw error
            }
        })
}

// Example usage: await assertRevertWithMessage(testDynamicType.revertWithReason(), "error occurred")
async function assertRevertWithMessage(transactionFunction, expectedErrorMessage) {
    try {
        transaction = await transactionFunction
        assert.isFalse(transaction.receipt.status, "Transaction was successful but should have failed")
    } catch (error) {
        if ((error + "").indexOf("revert") < 0) {
            throw error
        } else {
            assert.equal(error.reason, expectedErrorMessage)
        }
    }
}

const assertEventFired = (tx, event) => {
    assert.isTrue(isEventLogInTransaction(tx, event), `Event ${event} was not fired`)
}

const isEventLogInTransaction = (tx, event) => {
    return tx.logs
        .filter(log => log.event === event)
        .length > 0
}

const assertEventArgumentCorrect = (transaction, eventName, eventArgKey, eventArgValue) => {
    assert.isTrue(doEventArgumentsContainFieldWithValue(transaction, eventName, eventArgKey, eventArgValue),
        `Event "${eventName}" does not contain key "${eventArgKey}" with value "${eventArgValue}"`)
}

const doEventArgumentsContainFieldWithValue = (transaction, eventName, eventArgKey, _eventArgValue) => {
    return transaction.logs
            .filter(log => log.event === eventName)
            .map(log => log.args[eventArgKey])
            .filter(eventArgValue => eventArgValue === _eventArgValue)
            .length > 0
}

const listenForEvent = event => new Promise((resolve, reject) => {
    event.watch((error, response) => {
        if (!error) {
            resolve(response.args)
        } else {
            reject(error)
        }
        event.stopWatching()
    })
})

const convertToPromise = functionWithCallbackParam => new Promise((resolve, reject) => {
    functionWithCallbackParam((error, response) => {
        if (!error) {
            resolve(response)
        } else {
            reject(error)
        }
    })
})

const increaseTestRpcTime = (web3, seconds) =>
    web3.currentProvider.send({jsonrpc: "2.0", method: "evm_increaseTime", params: [seconds], id: 0})

const mineBlock = (web3) =>
    web3.currentProvider.send({jsonrpc: '2.0', method: 'evm_mine', id: new Date().getTime()})


module.exports = {
    assertThrowsMessage,
    assertThrows,
    assertThrowsSinceByzantium,
    assertRevertWithMessage,
    assertEventFired,
    listenForEvent,
    convertToPromise,
    increaseTestRpcTime
}