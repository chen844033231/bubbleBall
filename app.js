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
    const stage = createStage()
    const world = new World(stage.ctx, stage.width, stage.height)

    world.init(function() {
        // init 10 bubble
        for(let i = 0; i < 10; i++) {
            world.add(new Bubble({
                x: Math.random() * world.width,
                y: Math.random() * world.height,
                r: Math.random() * 100,
                speed: [rand(-5, 5), rand(-5, 5)],
                color: `rgb(${rand(255)}, ${rand(255)}, ${rand(255)})`,
            }))
        }
    })

    world.update(function() {
        world.objects.forEach(bubble => bubble.move())
    })

    world.start()
}()