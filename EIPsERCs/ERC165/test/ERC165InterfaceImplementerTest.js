const ERC165InterfaceImplementer = artifacts.require("ERC165InterfaceImplementer")

contract("ERC165InterfaceImplementer", () => {

    let erc165InterfaceImplementer
    const interfaceId = "0x1a78bc72";

    beforeEach(async () => {
        erc165InterfaceImplementer = await ERC165InterfaceImplementer.new()
    })

    it("registers the expected Interface ID", async () => {
        console.log("    InterfaceId: " + await erc165InterfaceImplementer.ERC165_INTERFACE_ID())
        const interfaceSupported = await erc165InterfaceImplementer.supportsInterface(interfaceId)
        assert.isTrue(interfaceSupported)
    })
})
