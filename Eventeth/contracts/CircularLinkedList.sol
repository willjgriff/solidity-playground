pragma solidity ^0.4.11;

// Inspired by: https://github.com/o0ragman0o/LibCLL/blob/master/LibCLL.sol
library CircularLinkedList {

    uint constant HEAD_AND_TAIL = 0;

    struct Node {
        uint previousNode;
        // Should be another Doubley Linked List of the voteIdsVotedIn that end at this nodes time.
        // To account for votes ending at the same time.
        uint voteId;
        uint nextNode;
    }
    
    struct LinkedList {
        mapping (uint => Node) linkedList;
    }

    function getNode(LinkedList storage self, uint nodeId)
        internal 
        constant 
        // returns (uint[3])
        returns (Node)
    {
        // return [self.linkedList[nodeId].previousNode, self.linkedList[nodeId].voteId, self.linkedList[nodeId].nextNode];
        return self.linkedList[nodeId];
    }

    // Insert newNode beside existingPreviousNode
    function insert(LinkedList storage self, uint existingPreviousNode, uint newNode) 
        internal  
    {
        uint existingNextNode = self.linkedList[existingPreviousNode].nextNode;
        stitch(self, existingPreviousNode, newNode);
        stitch(self, newNode, existingNextNode);
    }
    
    // If we remove a node that isn't part of the linked list then this will break the linked list.
    // We can check for this and prevent it...
    function remove(LinkedList storage self, uint nodeId) internal returns (uint) {
        if (nodeId == HEAD_AND_TAIL) throw;
        stitch(self, self.linkedList[nodeId].previousNode, self.linkedList[nodeId].nextNode);
        delete self.linkedList[nodeId].previousNode;
        delete self.linkedList[nodeId].nextNode;
        return nodeId;
    }

    // Creates a bidirectional link between two nodes
    function stitch(LinkedList storage self, uint previousNode, uint newNode) 
        private  
    {
        self.linkedList[newNode].previousNode = previousNode;
        self.linkedList[previousNode].nextNode = newNode;
    }
}