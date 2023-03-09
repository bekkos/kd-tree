const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.height = innerHeight;
canvas.width = innerWidth;


//let p = [{x: 1, y: 2}, {x: 3, y: 5}, {x: 8, y: 2}, {x: 12, y: 6}, {x: 4, y: 1}, {x: 7, y: 9}, {x: 5, y: 4}, {x: 11, y: 11}, {x: 11, y: 2}, {x: 7, y: 1}];
let p = []
for(let i = 0; i < 100; i++) {
    p.push({x: Math.floor(Math.random()*innerWidth), y: Math.floor(Math.random()*innerHeight)})
}

class Node {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.left = null;
        this.right = null;
        this.color = "#fff";
    }
}

const kdtree = (points, depth) => {
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
        node.left = kdtree(points.slice(0, medianIndex), depth+1);
        node.right = kdtree(points.slice(medianIndex+1, points.length), depth+1);
    } catch {}
    return node;
}

let node = kdtree(p, 0);


function printTree(node) {
    if (node !== null) {
        printTree(node.left);
        console.log(node.x, node.y);
        printTree(node.right);
    }
}

function searchKdTree(node, point) {
    if (node === null) {
      return null;
    }
  
    if (node.x === point.x && node.y === point.y) {
      return node;
    }
  
    if (node.x > point.x || (node.x === point.x && node.y > point.y)) {
      return searchKdTree(node.left, point);
    } else {
      return searchKdTree(node.right, point);
    }
}

function nearestNeighborSearch(node, target) {
    let bestNode = null;
    let bestDist = Number.MAX_VALUE;

    function recursiveSearch(currentNode, depth) {
        if (!currentNode) {
            return;
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

function euclideanDistance(node, target) {
    const dx = node.x - target.x;
    const dy = node.y - target.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function insert(node, point, depth = 0) {
    if (node === null) {
      return new Node(point.x, point.y);
    }
  
    const splitDimension = depth % 2;
  
    if (node.x === point.x && node.y === point.y) {
      return node;
    }
  
    if (point[splitDimension] < node[splitDimension]) {
      node.left = insert(node.left, point, depth + 1);
    }
  
    else {
      node.right = insert(node.right, point, depth + 1);
    }
  
    return node;
  }

let n = new Node();
n.x = innerWidth / 2;
n.y = innerHeight / 2;
n.color = "green";
window.addEventListener('mousemove', (e) => {
    n.x = e.x;
    n.y = e.y;
})


function switchBack(node) {
    node.color = "#fff";
    try {
        switchBack(node.left);
        switchBack(node.right);
    } catch {}
}



function draw(node) {
    ctx.fillStyle = node.color;
    ctx.beginPath();
    ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI);
    ctx.fill();
    try {
        draw(node.left)
        draw(node.right)
    } catch {}
}

function drawStaticNode(node) {
    ctx.fillStyle = node.color;
    ctx.beginPath();
    ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI);
    ctx.fill();
}



function step() {
    ctx.clearRect(0,0, innerWidth, innerHeight)
    switchBack(node)
    let res = nearestNeighborSearch(node, n);
    res.color = "red";
    draw(node)
    drawStaticNode(n)


    console.log("ran")
}

function start() {
    setInterval(step, 16.7);
}

start();