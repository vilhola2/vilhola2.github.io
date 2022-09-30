var elapsed = 0.0
var deltaTime
var sprite

function update(deltaTime) {
    elapsed += deltaTime
    sprite.x = 100.0 + Math.cos(elapsed / 50.0) * 100.0
}

window.onload = () => {
    let app = new PIXI.Application({ width: 640, height: 360 })
    document.body.appendChild(app.view)
    sprite = PIXI.Sprite.from('./game/player.png')
    app.stage.addChild(sprite)
    app.ticker.add(update);
}