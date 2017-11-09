const Reentrance = artifacts.require("Reentrance.sol")
const ReentranceAttack = artifacts.require("ReentranceAttack.sol")

contract("ReentranceAttack", accounts => {

    let reentrance, reentranceAttack

    beforeEach(async () => {
        reentrance = await Reentrance.new()
        reentranceAttack = await ReentranceAttack.new(reentrance.address)
    })

    it("should drain Reentrance of all it's ether", async () => {
        await reentrance.donate(accounts[0], {value: web3.toWei(1, 'ether')})
        await reentrance.donate(reentranceAttack.address, {value: web3.toWei(1, 'ether')})
        await reentranceAttack.attackReentrance()

        const reentranceBalance = web3.eth.getBalance(reentrance.address)

        assert.equal(reentranceBalance.toNumber(), 0)
    })
})