pragma solidity ^0.4.15;

// Inspired by: https://github.com/o0ragman0o/LibCLL/blob/master/LibCLL.sol
// TODO: Extract Ascending LinkedList functionality.
library LinkedList {

	uint public constant HEAD_AND_TAIL = 0;

	struct Node {
		uint previousNode;
		uint nextNode;
	}

	struct LinkedList {
		mapping (uint => Node) linkedList;
        uint size;
	}

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
		require(isNode(self, nodeId));
		return self.linkedList[nodeId];
	}

    function validAscendingInsertion(LinkedList storage self, uint previousNodeId, uint newNode)
        internal
        returns (bool)
    {
        Node previousNode = self.linkedList[previousNodeId];
        if (previousNodeId > newNode || (previousNode.nextNode < newNode && previousNode.nextNode != 0)) return false;
        return true;
    }

	function insert(LinkedList storage self, uint previousNode, uint newNode)
		internal
	{
		require(isNode(self, previousNode));
		require(!isNode(self, newNode));
        require(validAscendingInsertion(self, previousNode, newNode));

		uint existingNextNode = self.linkedList[previousNode].nextNode;
		stitch(self, previousNode, newNode);
		stitch(self, newNode, existingNextNode);
        self.size++;
	}

	function remove(LinkedList storage self, uint nodeId)
		internal
		returns (uint)
	{
		notHeadOrTail(nodeId);
		require(isNode(self, nodeId));

		stitch(self, self.linkedList[nodeId].previousNode, self.linkedList[nodeId].nextNode);
		delete self.linkedList[nodeId].previousNode;
		delete self.linkedList[nodeId].nextNode;
        self.size--;
		return nodeId;
	}

	function stitch(LinkedList storage self, uint previousNode, uint newNode)
		private
	{
		self.linkedList[newNode].previousNode = previousNode;
		self.linkedList[previousNode].nextNode = newNode;
	}

    function getPreviousNodePosition(LinkedList storage self, uint newNode) public constant returns (uint) {
        uint currentNode = HEAD_AND_TAIL;
        while (self.linkedList[currentNode].nextNode != 0 && self.linkedList[currentNode].nextNode < newNode) {
            currentNode = self.linkedList[currentNode].nextNode;
        }
        return currentNode;
    }

}