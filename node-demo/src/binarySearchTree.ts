import { makeArr } from "./helper";

class BtNode {

    data: number;
    left: BtNode;
    right: BtNode;

    constructor(data, left, right) {
        this.data = data;
        this.left = left;
        this.right = right;
    }

}

class BinarySearchTree {
    root: BtNode;

    constructor() {
        this.root = null;
    }

    insert(data) {
        let n = new BtNode(data, null, null);
        if (!this.root) {
            this.root = n;
        }
        let currentNode = this.root;
        while (true) {
            let parent = currentNode;
            if (n.data < currentNode.data) {
                currentNode = parent.left;
                if (currentNode === null) {
                    parent.left = n;
                    break;
                }
            } else if (n.data > currentNode.data) {
                currentNode = parent.right;
                if (currentNode === null) {
                    parent.right = n;
                    break;
                }
            } else {
                console.log('已经有相同的值');
                break;
            }
        }
    }

    remove(data) {
        this.root = this.removeNode(this.root, data);
    }

    removeNode(node, data) {
        if (node == null) {
            return null;
        }
        if (node.data === data) {
            if (node.left === null && node.right === null) {
                return null;
            }
            if (node.left === null) {
                return node.right;
            }
            if (node.right === null) {
                return node.left;
            }
        }
        if (data < node.left) {
            this.removeNode(node.left, data);
        }

    }

}

let bt = new BinarySearchTree();

makeArr(10).map(n => {
    bt.insert(n);
});
console.log(JSON.stringify(bt));
