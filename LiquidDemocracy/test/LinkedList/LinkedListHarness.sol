pragma solidity ^0.4.15;

//import "./LinkedList.sol";
import "../../contracts/LinkedList.sol";

contract LinkedListHarness {

    using LinkedList for LinkedList.LinkedList;

    LinkedList.LinkedList private linkedList;

    function getNode(uint nodeId) public constant returns (uint256[2]) {
        LinkedList.Node storage node = linkedList.getNode(nodeId);
        return [node.previousNode, node.nextNode];
    }

    function insert(uint previousNode, uint newNode) public {
        linkedList.insert(previousNode, newNode);
    }

    function getPreviousNodePosition(uint newNode) public constant returns (uint) {
        return linkedList.getPreviousNodePosition(newNode);
    }
}
