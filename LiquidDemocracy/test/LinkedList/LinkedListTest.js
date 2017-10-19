// const LinkedList = artifacts.require("LinkedList.sol")
// const LinkedListHarness = artifacts.require("LinkedListHarness.sol")
//
// contract("LinkedList", () => {
//
//     let linkedListHarness
//
//     beforeEach(async () => {
//         // linkedList = await LinkedList.new()
//         LinkedListHarness.link("LinkedList", LinkedList.address)
//         linkedListHarness = await LinkedListHarness.new()
//     })
//
//     describe("insert(uint previousNode, uint newNode)", () => {
//
//         it("inserts new node with correct previous and next nodes", async () => {
//             await linkedListHarness.insert(0, 12)
//             const insertedNode = await linkedListHarness.getNode(12)
//
//             assert.equal(insertedNode[0], 0, "Inserted node's previous node is incorrect")
//             assert.equal(insertedNode[1], 0, "Inserted node's next node is incorrect")
//         })
//     })
//
//     describe("getPreviousNodePosition(LinkedList storage self, uint newNode)", () => {
//
//         it("gets the correct previous node", async () => {
//             await linkedListHarness.insert(0, 12)
//             await linkedListHarness.insert(12, 14)
//             await linkedListHarness.insert(14, 20)
//             const previousNodePosition = await linkedListHarness.getPreviousNodePosition(21)
//
//             assert.equal(previousNodePosition.toNumber(), 20, "Previous node position is incorrect")
//         })
//     })
// })