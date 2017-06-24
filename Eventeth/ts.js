var LibPlay = artifacts.require("./LibPlay.sol")
var libPlay = LibPlay.at(LibPlay.address)

libPlay.getNextItem(0)

module.exports = (callback) => {}