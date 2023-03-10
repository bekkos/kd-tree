const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.height = innerHeight;
canvas.width = innerWidth;

// ARRAY TO GENERATE MAP (RANDOMIZED)
let p = []
for(let i = 0; i < 40; i++) {
    p.push({x: Math.floor(Math.random()*innerWidth), y: Math.floor(Math.random()*innerHeight)})
}

let tree;
let players;

// CONSTANTS
let gravity = 0.01;
let ropeSpringConstant = 1.05;
let ropeDampingConstant = 0.1;



// INPUT
let leftPress = false;
let rightPress = false;

window.addEventListener('keydown', e => {
    if(e.keyCode == 32) {
        players.forEach(p => {
            if(p.steerable) {
                p.connected = !p.connected;
                p.anchor = tree.nearestNeighborSearch(tree.root, p)
            }
        })
    }
    if(e.keyCode == 65) {
        leftPress = true;
    }
    if(e.keyCode == 68) {
        rightPress = true;
    }
})




function render() {
    ctx.clearRect(0,0, innerWidth, innerHeight)
    tree.render(tree.root);
    players.forEach(p => {
        p.render();
        p.drawLineTo(p.target, "white");
        if(p.connected) p.drawLineTo(p.anchor, "green")
    })
}

function step() {
    tree.resetColors(tree.root)
    players.forEach(p => {
        p.target = tree.nearestNeighborSearch(tree.root, p);
        if(p.connected) p.calcualteSwing(p, p.anchor)
        p.move();
    })
    render();
}

function generatePlayers() {
    let s = new Player(innerWidth/2, innerHeight/2, true);
    s.anchor = tree.nearestNeighborSearch(tree.root, s);
    s.connected = true;
    s.color = "green";

    let e = new Player(innerWidth/4, innerHeight/4, false);
    e.anchor = tree.nearestNeighborSearch(tree.root, e);
    e.connected = true;
    e.color = "red";
    players = [s, e];
}

function start() {
    tree = new KDTree(p);
    generatePlayers();
    setInterval(step, 16.7);
}

start();