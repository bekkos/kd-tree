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