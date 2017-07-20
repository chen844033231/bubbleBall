class World {
    constructor(ctx, width, height, objects) {
        this.ctx = ctx
        this.width = width || 300
        this.height = height || 300
        this.objects = objects || []
        this._initCallback = function() {}
        this._updateCallback = function() {}
    }

    add(obj) {
        this.objects.push(obj)
    }

    remove(obj) {
        const index = this.objects.indexOf(obj)
        if (~index) {
            this.objects.splice(index, 1)
        }
    }

    start() {
        this._initCallback()
        this.draw()
    }

    init(callback) {
        // init hooks
        if (typeof callback === 'function') {
            this._initCallback = callback
        }
    }

    update(callback) {
        // update hooks
        if (typeof callback === 'function') {
            this._updateCallback = callback
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height)
        this.ctx.beginPath()

        this.objects.forEach(obj => obj.draw(this.ctx))

        // invoke update hooks
        this._updateCallback.call(this, this.objects)

        window.requestAnimationFrame = window.requestAnimationFrame || window.requestWebkitAnimationFrame
        window.requestAnimationFrame(this.draw.bind(this))
    }
}

const rand = function (min, max) {
    if (typeof max === 'undefined') {
        return Math.floor(Math.random() * min + 1)
    }
    return Math.floor(Math.random() * (max - min + 1)) + min
}

const createStage = function () {
    const canvas = document.createElement('canvas')
    canvas.width = document.documentElement.clientWidth
    canvas.height = document.documentElement.clientHeight
    document.body.appendChild(canvas)
    const ctx = canvas.getContext('2d')
    return {
        ctx,
        width: canvas.width,
        height: canvas.height,
    }
}

// start here
~function() {
    let mouseX = 0
    let mouseY = 0
    const stage = createStage()
    const world = new World(stage.ctx, stage.width, stage.height)
    const redMap = new Image()
    const blueMap = new Image()
    redMap.src = './red.png'
    blueMap.src = './blue.png'
    const createBubble = function(option) {
        option = option || {}
        return new Bubble(Object.assign({
            x: Math.random() * world.width,
            y: Math.random() * world.height,
            r: Math.random() * 50,
            speed: {x: rand(-2, 2), y: rand(-2, 2)},
            color: '#00ff00',
            map: blueMap,
        }, option))
    }
    const redBubble = createBubble({
        x: world.width / 2,
        y: world.height / 2,
        r: 30,
        color: '#ff0000',
        map: redMap,
    })
    world.init(function() {
        world.add(redBubble)
        // init 10 bubble
        for(let i = 0; i < 20; i++) {
            world.add(createBubble())
        }
    })

    world.update(function() {
        redBubble.track({x: mouseX, y: mouseY})
        redBubble.range({x: 0, y: 0, x1: world.width, y1: world.height})
        world.objects.forEach(bubble => {
            if (bubble !== redBubble) {
                if(bubble.lifeTime < bubble.maxLifeTime) {
                    bubble.move()
                } else {
                    world.remove(bubble)
                    world.objects.push(createBubble())
                }

                // hit bubble
                if (Bubble.hitBubble(redBubble, bubble)) {
                    if (redBubble.speed.x * bubble.speed.x < 0) {
                        bubble.speed.x *= -1.2
                        redBubble.speed.x *= -0.8
                    } else if (redBubble.speed.x * bubble.speed.x === 0) {
                        bubble.speed.x = redBubble.speed.x * 0.8
                        redBubble.speed.x *= -0.8
                    } else {
                        bubble.speed.x *= 1.2
                        redBubble.speed.x *= 0.8
                    }
                    if (redBubble.speed.y * bubble.speed.y < 0) {
                        bubble.speed.y *= -1.2
                        redBubble.speed.y *= -0.8
                    } else if (redBubble.speed.y * bubble.speed.y === 0) {
                        bubble.speed.y = redBubble.speed.y * 0.8
                        redBubble.speed.y *= -0.8
                    } else {
                        bubble.speed.y *= 1.2
                        redBubble.speed.y *= 0.8
                    }
                }
            }
        })
    })

    world.start()

    window.addEventListener('mousemove', (e) => {
        mouseX = e.pageX
        mouseY = e.pageY
    }, false)
}()