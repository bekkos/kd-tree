class KDTree {
    constructor(points) {
        this.root = this.generate(points, 0);
    }

    generate(points, depth) {
        // Select axis based on depth so that axis cycles through all valid values
        let axis = depth % 2;
        switch(axis) {
            case 0:
                points.sort((a,b) => a.x - b.x);
                break;
            case 1:
                points.sort((a,b) => a.y - b.y);
                break;
        }

        let medianIndex = Math.floor(points.length / 2);
        let median = points[medianIndex];
        // Create node and construct subtree
        let node = new Node(median.x, median.y);
        try {
            node.left = this.generate(points.slice(0, medianIndex), depth+1);
            node.right = this.generate(points.slice(medianIndex+1, points.length), depth+1);
        } catch {}
        return node;
    }

    printTree(node) {
        if (node !== null) {
            this.printTree(node.left);
            console.log(node.x, node.y);
            this.printTree(node.right);
        }
    }

    search(node, point) {
        if (node === null) {
          return null;
        }
      
        if (node.x === point.x && node.y === point.y) {
          return node;
        }
      
        if (node.x > point.x || (node.x === point.x && node.y > point.y)) {
          return this.search(node.left, point);
        } else {
          return this.search(node.right, point);
        }
    }

    insert(node, point, depth = 0) {
        if (node === null) {
          return new Node(point.x, point.y);
        }
      
        const splitDimension = depth % 2;
      
        if (node.x === point.x && node.y === point.y) {
          return node;
        }
      
        if (point[splitDimension] < node[splitDimension]) {
          node.left = this.insert(node.left, point, depth + 1);
        }
      
        else {
          node.right = this.insert(node.right, point, depth + 1);
        }
      
        return node;
    }

    resetColors(node) {
        node.color = "#fff";
        try {
            this.resetColors(node.left);
            this.resetColors(node.right);
        } catch {}
    }

    render(node) {
        node.render();
        try {
            this.render(node.left);
            this.render(node.right);
        }catch {}
    }
    
    nearestNeighborSearch(node, target) {
        let bestNode = null;
        let bestDist = Number.MAX_VALUE;
    
        function recursiveSearch(currentNode, depth) {
            if (!currentNode) {
                return;
            }
            function euclideanDistance(node, target) {
                const dx = node.x - target.x;
                const dy = node.y - target.y;
                return Math.sqrt(dx * dx + dy * dy);
            }
    
            const dist = euclideanDistance(currentNode, target);
            if (dist < bestDist) {
                bestNode = currentNode;
                bestDist = dist;
            }
    
            const dim = depth % 2;
            const targetCoord = dim == 0 ? target.x : target.y;
            const currentCoord = dim == 0 ? currentNode.x : currentNode.y;
            const leftNode = currentCoord > targetCoord ? currentNode.left : currentNode.right;
            const rightNode = currentCoord > targetCoord ? currentNode.right : currentNode.left;
    
            recursiveSearch(leftNode, depth + 1);
    
            if (Math.abs(targetCoord - currentCoord) < bestDist) {
                recursiveSearch(rightNode, depth + 1);
            }
        }
    
        recursiveSearch(node, 0);
        return bestNode;
    }

}