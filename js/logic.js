const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.height = innerHeight;
canvas.width = innerWidth;


let p = []
for(let i = 0; i < 40; i++) {
    p.push({x: Math.floor(Math.random()*innerWidth), y: Math.floor(Math.random()*innerHeight)})
}

class Node {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.left = null;
        this.right = null;
        this.color = "#fff";
        this.xvel = 0;
        this.yvel = 0;
    }

    render() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 7.5, 0, 2 * Math.PI);
        ctx.fill();
    }

    drawLineTo(target, color) {
        ctx.beginPath();
        ctx.fillStyle = "#fff";
        ctx.strokeStyle = color;
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(target.x, target.y);
        ctx.stroke();
    }
}

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

}



function nearestNeighborSearch(node, target) {
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


let connected = true;
let gravity = 0.01;

let ropeSpringConstant = 0.05;
let ropeDampingConstant = 0.1;


function calcualteSwing(player, anchor) {
    if(connected) {

        let length = Math.sqrt((player.x - anchor.x) ** 2 + (player.y - anchor.y) ** 2);
        let angle = Math.atan2(anchor.y - player.y, anchor.x - player.x);
    
        const dx = anchor.x - player.x;
        const dy = anchor.y - player.y;
        const distance = Math.sqrt(dx ** 2 + dy ** 2);
    
        // Calculate the force of the spring
        const springForce = ropeSpringConstant * (distance - length);
    
        // Calculate the damping force
        const dampingForce = ropeDampingConstant * (dx * player.xvel + dy * player.yvel) / distance;
    
        // Calculate the total force on the player
        const totalForce = {
        x: (springForce + dampingForce) * Math.cos(angle),
        y: (springForce + dampingForce) * Math.sin(angle)
        };
    
        // Update the player's velocity
        player.xvel -= totalForce.x*1.1;
        player.yvel -= (totalForce.y-gravity)*1.1;
    } else {
        applyGravity();
    }

}

let tree = new KDTree(p);
let m = new Node(innerWidth/2,innerHeight/2);
m.color = "green";
// window.addEventListener('mousemove', (e) => {
//     m.x = e.x;
//     m.y = e.y;
// })

let nearest = nearestNeighborSearch(tree.root, m);

window.addEventListener('keydown', e => {
    if(e.keyCode == 32) {
        connected = !connected;
        nearest = nearestNeighborSearch(tree.root, m);
        nearest.color = "red";
    }
    if(e.keyCode == 65 && connected) {
        m.xvel -= 3;
    }
    if(e.keyCode == 68 && connected) {
        m.xvel += 3;
    }
})

function movePlayer() {
    
    m.x += m.xvel;
    m.y += m.yvel;
}

function applyGravity() {
    m.yvel += gravity;
}


function render(target) {
    ctx.clearRect(0,0, innerWidth, innerHeight)
    tree.render(tree.root);
    m.render();
    if(connected) m.drawLineTo(nearest, "green")
    m.drawLineTo(target, "white");
}

function step() {
    tree.resetColors(tree.root)
    calcualteSwing(m, nearest)
    movePlayer();
    let target = nearestNeighborSearch(tree.root, m);
    render(target);
}

function start() {
    setInterval(step, 16.7);
}

start();