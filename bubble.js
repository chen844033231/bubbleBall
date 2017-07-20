class Bubble {
    constructor(option) {
        this.x = option.x || 0
        this.y = option.y || 0
        this.r = option.r || 10
        this.speed = option.speed || {x: 0, y:0}
        this.color = option.color || '#ff0000'
        // bubble image
        this.map = option.map
        this.lifeTime = 1
        this.maxLifeTime = Math.random() * 1000 + 800
    }

    draw(ctx) {
        if (this.map) {
            ctx.drawImage(this.map, 40, 40, this.map.width - 80, this.map.height - 80, this.x - this.r, this.y - this.r, this.r * 2, this.r * 2)
        } else {
            ctx.beginPath()
            ctx.fillStyle = this.color
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2)
            ctx.closePath()
            ctx.fill()
        }
    }

    move() {
        this.lifeTime += 1
        this.x += this.speed.x
        this.y += this.speed.y
    }

    track(point) {
        const dx = point.x - this.x
        const dy = point.y - this.y
        const distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))
        this.speed.x += (dx / distance) * (this.lifeTime / 500)
        this.speed.y += (dy / distance) * (this.lifeTime / 500)
        this.lifeTime += 1
        if (distance < this.r) {
            this.lifeTime = 1
            this.speed.x = 0
            this.speed.y = 0
        }
        this.x += this.speed.x
        this.y += this.speed.y
    }

    range(rect) {
        if (this.x < rect.x) {
            this.x = rect.x
            this.speed.x *= -1
        } else if (this.y < rect.y) {
            this.y = rect.y
            this.speed.y *= -1
        } else if (this.x > rect.x1) {
            this.x = rect.x1
            this.speed.x *= -1
        } else if (this.y > rect.y1) {
            this.y = rect.y1
            this.speed.y *= -1
        }
    }
}

Bubble.hitBubble = function(bubble, otherBubble) {
    if (bubble === otherBubble) {
        return false
    }
    const dx = bubble.x - otherBubble.x
    const dy = bubble.y - otherBubble.y
    const minDistance = bubble.r + otherBubble.r
    const distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))
    if (distance < minDistance) {
        return true
    }
    return false
}