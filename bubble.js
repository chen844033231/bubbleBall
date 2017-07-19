class Bubble {
    constructor(option) {
        this.x = option.x || 0
        this.y = option.y || 0
        this.r = option.r || 10
        this.speed = option.speed || [10, 10]
        this.color = option.color || '#ff0000'
    }

    draw(ctx) {
        ctx.beginPath()
        ctx.fillStyle = this.color
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2)
        ctx.closePath()
        ctx.fill()
    }

    hitBubble(otherBubble) {
        const dx = this.x - otherBubble.x
        const dy = this.y - otherBubble.y
        const minDistance = this.r + otherBubble.r
        const distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))

        if (distance < minDistance) {
            return true
        }
        return false
    }

    move() {
        this.x += this.speed[0]
        this.y += this.speed[1]
    }
}