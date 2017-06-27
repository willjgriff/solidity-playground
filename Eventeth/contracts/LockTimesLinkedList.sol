pragma solidity ^0.4.11;

import "./VoteIdsLinkedList.sol";

// Inspired by: https://github.com/o0ragman0o/LibCLL/blob/master/LibCLL.sol
// Unfortunately the lack of generics and lack of inheritance available in libraries prevents
// abstraction of functionality for now. This linkedList is copied into VoteIdsLinkedList
// for use in this linkedList's Node. It is built in a way so that both this and the VoteIdsLinkedList
// should be easily replaceable with a generic linked list in the future.

// NOTE: The inner VoteIdsLinkedList can be removed in favour of an array but then we remove the capability to see which
// voteIds a lockTime relate to.
library LockTimesLinkedList {
    
    using VoteIdsLinkedList for VoteIdsLinkedList.LinkedList;

    uint constant HEAD_AND_TAIL = 0;

    struct Node {
        uint previousNode;
        uint nextNode;
        // This should be a generic type
        NodeData nodeData;
    }
    
    struct NodeData {
        VoteIdsLinkedList.LinkedList voteIds;
        uint voteIdsCount;
    }
    
    struct LinkedList {
        mapping (uint => Node) linkedList;
    }

    // Should be a modifier, libraries can't seem to have them yet.
    function notHeadOrTail(uint nodeId) {
        if (nodeId == HEAD_AND_TAIL) throw;
    }
    
    function isNode(LinkedList storage self, uint nodeId) internal returns (bool) {
        if (self.linkedList[nodeId].previousNode == HEAD_AND_TAIL 
            && self.linkedList[nodeId].nextNode == HEAD_AND_TAIL 
            && self.linkedList[HEAD_AND_TAIL].previousNode != nodeId) return false;
        return true;
    }

    function getNode(LinkedList storage self, uint nodeId)
        internal 
        constant 
        returns (Node storage)
    {
        // Modifiers don't seem to work in libs so for now this will suffice.
        require(isNode(self, nodeId));

        return self.linkedList[nodeId];
    }

    function insert(LinkedList storage self, uint existingPreviousNode, uint newNode) 
        internal
    {
        // Modifiers don't seem to work in libs so for now this will suffice.
        require(isNode(self, existingPreviousNode));
        require(!isNode(self, newNode));

        uint existingNextNode = self.linkedList[existingPreviousNode].nextNode;
        stitch(self, existingPreviousNode, newNode);
        stitch(self, newNode, existingNextNode);
    }

    function remove(LinkedList storage self, uint nodeId) 
        internal 
        returns (uint)
    {
        // Modifiers don't seem to work in libs so for now this will suffice.
        notHeadOrTail(nodeId);
        require(isNode(self, nodeId));

        stitch(self, self.linkedList[nodeId].previousNode, self.linkedList[nodeId].nextNode);
        delete self.linkedList[nodeId].previousNode;
        delete self.linkedList[nodeId].nextNode;
        return nodeId;
    }

    function stitch(LinkedList storage self, uint previousNode, uint newNode) 
        internal  
    {
        self.linkedList[newNode].previousNode = previousNode;
        self.linkedList[previousNode].nextNode = newNode;
    }
}