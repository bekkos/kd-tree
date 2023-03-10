class Player {
    constructor(x, y, steerable) {
        this.x = x;
        this.y = y;
        this.xvel = 0;
        this.yvel = 0;
        this.color = "#green";
        this.steerable = steerable;
        this.target = null;
        this.anchor = null;
        this.connected = false;
    }

    render() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 7.5, 0, 2 * Math.PI);
        ctx.fill();
    }

    drawLineTo(target, color) {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(target.x, target.y);
        ctx.stroke();
    }

    move() {
        this.x += this.xvel;
        this.y += this.yvel;
    }

    applyGravity() {
        this.yvel += gravity;
    }

    calcualteSwing(player, anchor) {
        if(player.connected) {
            let length = Math.sqrt((player.x - anchor.x) ** 2 + (player.y - anchor.y) ** 2);
            let angle = Math.atan2(anchor.y - player.y, anchor.x - player.x);
        
            const dx = anchor.x - player.x;
            const dy = anchor.y - player.y;
            const distance = Math.sqrt(dx ** 2 + dy ** 2);
        
            const springForce = ropeSpringConstant * (distance - length);
        
            let dampingForce = ropeDampingConstant * (dx * player.xvel + dy * player.yvel) / distance;
            let totalForce = {
                x: (springForce + dampingForce) * Math.cos(angle),
                y: (springForce + dampingForce-gravity) * Math.sin(angle)
            };
    
            if(leftPress && player.steerable) totalForce.x = (springForce + dampingForce) * (-Math.cos(angle)) + 1; leftPress = false;
            if(rightPress && player.steerable) totalForce.x -= 1; rightPress = false;
        
            player.xvel -= totalForce.x*1.1;
            player.yvel -= (totalForce.y - gravity)*1.1;
        } else {
            this.applyGravity();
        }
    }

    
}