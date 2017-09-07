
// Copied from internet, original is here: https://gist.github.com/xavierlepretre/d5583222fde52ddfbc58b7cfa0d2d0a9
exports.assertThrows = (action, gasToUse) => {
    return new Promise((resolve, reject) => {
        try {
            resolve(action());
        } catch(e) {
            reject(e);
        }
    })
        .then((txn) => {
            // Note I have removed the part allowing us to test on Geth, which requires
            // the below function see original to enable testing on Geth.
            // https://gist.github.com/xavierlepretre/88682e871f4ad07be4534ae560692ee6
            assert.equal(txn.receipt.gasUsed, gasToUse, "should have used all the gas");
        })
        .catch((e) => {
            if ((e + "").indexOf("invalid opcode") > -1 || (e + "").indexOf("out of gas") > -1) {
                // We are in TestRPC
            } else if ((e + "").indexOf("please check your gas amount") > -1) {
                // We are in Geth for a deployment
            } else {
                throw e;
            }
        });
};