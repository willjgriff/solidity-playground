pragma solidity ^0.4.11;

// Inspired by: https://github.com/o0ragman0o/LibCLL/blob/master/LibCLL.sol
library LinkedList {
    
    uint public constant HEAD_AND_TAIL = 0;

    struct Node {
        uint previousNode;
        uint nextNode;
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
    
    function headTailIndex() constant returns (uint) {
        return HEAD_AND_TAIL;
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

    function insert(LinkedList storage self, uint previousNode, uint newNode) 
        internal
    {
        // Modifiers don't seem to work in libs so for now this will suffice.
        require(isNode(self, previousNode));
        require(!isNode(self, newNode));

        uint existingNextNode = self.linkedList[previousNode].nextNode;
        stitch(self, previousNode, newNode);
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
        private  
    {
        self.linkedList[newNode].previousNode = previousNode;
        self.linkedList[previousNode].nextNode = newNode;
    }
    
}