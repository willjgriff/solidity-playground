const ERC165InterfaceCaller = artifacts.require("ERC165InterfaceCaller")
const ERC165InterfaceImplementer = artifacts.require("ERC165InterfaceImplementer")
const ERC165Empty = artifacts.require("ERC165Empty")

contract("ERC165InterfaceCaller", accounts => {

    let erc165InterfaceCaller, erc165InterfaceImplementer, erc165Empty

    beforeEach(async () => {
        erc165InterfaceCaller = await ERC165InterfaceCaller.new()
        erc165InterfaceImplementer = await ERC165InterfaceImplementer.new()
        erc165Empty = await ERC165Empty.new()
    })

    it("callImplementation(address erc165Address) with implementation address returns expected result", async () => {
        const returnValue = await erc165InterfaceCaller.callImplementation(erc165InterfaceImplementer.address)
        assert.equal(returnValue, 123)
    })

    it("callImplementation(address erc165Address) with non implementation address returns expected result", async () => {
        const returnValue = await erc165InterfaceCaller.callImplementation(erc165Empty.address)
        assert.equal(returnValue, 456)
    })

    it("callImplementationUsingLib(address erc165Address) with implementation address returns expected result", async () => {
        const returnValue = await erc165InterfaceCaller.callImplementationUsingLib(erc165InterfaceImplementer.address)
        assert.equal(returnValue, 123)
    })

    it("callImplementationUsingLib(address erc165Address) with non implementation address returns expected result", async () => {
        const returnValue = await erc165InterfaceCaller.callImplementationUsingLib(erc165Empty.address)
        assert.equal(returnValue, 456)
    })
})