
// TODO: Tidy this up and understand how it works.
const getTransactionReceiptMined = (txHash, interval) => {

    const transactionReceiptAsync = function (resolve, reject) {

        this.getTransactionReceipt(txHash, (error, receipt) => {
            if (error) {
                reject(error);
            } else if (receipt == null) {
                setTimeout(
                    () => transactionReceiptAsync(resolve, reject),
                    interval ? interval : 500);
            } else {
                resolve(receipt);
            }
        });
    };

    if (Array.isArray(txHash)) {
        return Promise.all(txHash.map(
            oneTxHash => this.getTransactionReceiptMined(oneTxHash, interval)));
    } else if (typeof txHash === "string") {
        return new Promise(transactionReceiptAsync);
    } else {
        throw new Error("Invalid Type: " + txHash);
    }
};

// Copied from here: https://gist.github.com/xavierlepretre/d5583222fde52ddfbc58b7cfa0d2d0a9
exports.assertThrows = (action, gasToUse) => {

    return new Promise((resolve, reject) => {
        try {
            resolve(action())
        } catch (e) {
            reject(e)
        }
    })
        .then(txn => {
            // https://gist.github.com/xavierlepretre/88682e871f4ad07be4534ae560692ee6
            return getTransactionReceiptMined(txn)
        })
        .then(receipt => {
            // We are in Geth
            assert.equal(receipt.gasUsed, gasToUse, "should have used all the gas")
        })
        .catch(error => {
            if ((error + "").indexOf("invalid JUMP") || (error + "").indexOf("out of gas") || (error + "").indexOf("invalid opcode") > -1) {
                // We are in TestRPC
            } else if ((error + "").indexOf("please check your gas amount") > -1) {
                // We are in Geth for a deployment
            } else {
                throw error
            }
        })
}