const canvasWidth = 640
const canvasHeight = 360

const speed = 1.5

var enemySpawnCooldown

var elapsed
var deltaTime
var background
var player
var scoreText
var score
var app

var gameOver

const KeyCodes = {
    W: 87,
    A: 65,
    S: 83,
    D: 68,
    Space: 32
}

var keysPressed = {}
var enemies
var lastEnemySpawn
var lastPointsGiven

function onKeyDown(key) {
    keysPressed[key.keyCode] = true
}

function onKeyUp(key) {
    keysPressed[key.keyCode] = false
}

function isColliding(ab, bb) {
    ab.x += ab.width / 2
    ab.y += ab.height / 2
    bb.x -= bb.width / 2
    bb.y -= bb.height / 2
    return ab.x + ab.width > bb.x && ab.x < bb.x + bb.width && ab.y + ab.height > bb.y && ab.y < bb.y + bb.height;
}

// --- game logic ---
function start() {
    background = PIXI.Sprite.from('./game/bg.jpeg')
    background.width = canvasWidth
    background.height = canvasHeight
    app.stage.addChild(background)

    let darkMask = new PIXI.Graphics()
    darkMask.beginFill(0x000000, .5)
    darkMask.drawRect(0, 0, canvasWidth, canvasHeight)
    darkMask.endFill()
    app.stage.addChild(darkMask)

    player = PIXI.Sprite.from('./game/player.png')
    player.height = 50
    player.width = 50
    player.x = canvasWidth / 2 - player.width / 2
    player.y = canvasHeight / 2 - player.height / 2
    app.stage.addChild(player)

    let frame = new PIXI.Graphics()
    frame.beginFill(0x666666, .5)
    frame.lineStyle({ color: 0xffffff, width: 4, alignment: 0 })
    frame.drawRect(0, 0, 200, 50)
    app.stage.addChild(frame)
    let mask = new PIXI.Graphics()
    mask.beginFill(0xffffff)
    mask.drawRect(0, 0, 200, 50)
    mask.endFill()

    let maskContainer = new PIXI.Container()
    maskContainer.mask = mask
    maskContainer.addChild(mask)
    frame.addChild(maskContainer)

    scoreText = new PIXI.Text('', {
        fontSize: 24,
        fill: 0xFFFFFF
    })
    scoreText.x = 10
    scoreText.y = 12.5
    maskContainer.addChild(scoreText)
    score = 0
    enemySpawnCooldown = 1000.0
    enemies = []
    lastEnemySpawn = Date.now() + 1000
    lastPointsGiven = Date.now() + 1500
    gameOver = false
}

function defeat() {
    for (let i = 0; i < enemies.length; i++) {
        app.stage.removeChild(enemies[i])
    }
    enemies = []

    let defeatText = new PIXI.Text('Paina välilyöntiä \naloittaaksesi uudestaan :))))))))', {
        fontFamily : 'Arial',
        fontSize: 24,
        fill : 0xFFFFFF,
        align : 'center'
    })
    defeatText.x = canvasWidth / 2 - defeatText.width / 2
    defeatText.y = canvasHeight / 2 - defeatText.height / 2
    app.stage.addChild(defeatText)
}

function update(deltaTime) {
    elapsed += deltaTime
    scoreText.text = `Pisteet: ${score}`
    if (gameOver) {
        if (keysPressed[KeyCodes.Space]) {
            for (var i = app.stage.children.length - 1; i >= 0; i--) {
                app.stage.removeChild(app.stage.children[i])
            }
            start()
        }
        return
    }
    let dx = 0
    let dy = 0

    if (player.y > 0 && keysPressed[KeyCodes.W])
        dy--
    if (player.y < canvasHeight - player.height && keysPressed[KeyCodes.S])
        dy++
    if (player.x < canvasWidth - player.width && keysPressed[KeyCodes.D])
        dx++
    if (player.x > 0 && keysPressed[KeyCodes.A])
        dx--
    // normalize dx and dy
    if (dx != 0 || dy != 0) {
        let m = Math.sqrt(dx * dx + dy * dy);
        dx = (dx / m) * speed
        dy = (dy / m) * speed
    }
    player.x += dx
    player.y += dy

    if (Date.now() - lastPointsGiven > 1000) {
        score++
        lastPointsGiven = Date.now()
    }

    if (Date.now() - lastEnemySpawn > enemySpawnCooldown) {
        let enemy = PIXI.Sprite.from('./game/enemy.png')
        enemy.width = 25
        enemy.height = 40
        let side = Math.floor(Math.random() * 4)
        switch(side) {
            case 0:
                enemy.x = Math.random() * canvasWidth - enemy.width / 2
                enemy.y = -enemy.height / 2
                break
            case 1:
                enemy.x = Math.random() * canvasWidth - enemy.width / 2
                enemy.y = canvasHeight  + enemy.height
                break
            case 2:
                enemy.x = -enemy.width / 2
                enemy.y = Math.random() * canvasHeight - enemy.height / 2
                break
            case 3:
                enemy.x = canvasWidth + enemy.width
                enemy.y = Math.random() * canvasHeight - enemy.height / 2
                break
        }
        enemy.rotation = Math.atan2((player.x + player.width / 2) - (enemy.x - enemy.width / 2), (enemy.y - enemy.height) - (player.y - player.height / 2))
        enemies.push(enemy)
        app.stage.addChild(enemy)

        enemySpawnCooldown *= .99
        lastEnemySpawn = Date.now()
    }

    for (let i = 0; i < enemies.length; i++) {
        let enemy = enemies[i]
        console.log()
        enemy.x += speed * Math.cos(enemy.rotation - Math.PI / 2)
        enemy.y += speed * Math.sin(enemy.rotation - Math.PI / 2)
        let ab = {
            x: player.x,
            y: player.y,
            width: player.width / 2,
            height: player.height / 2
        }
        let bb = {
            x: enemy.x,
            y: enemy.y,
            width: enemy.width / 2,
            height: enemy.height / 2
        }
        if (isColliding(ab, bb)) {
            gameOver = true
            defeat()
            return
        }
        if (enemy.x > canvasWidth + enemy.width || enemy.x < -enemy.width || enemy.y > canvasHeight + enemy.height || enemy.y < -enemy.height) {
            enemies.splice(i, 1)
            app.stage.removeChild(enemy)
        }
    }
}
// -------------------

window.onload = () => {
    app = new PIXI.Application({
        width: canvasWidth, height: canvasHeight,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
        resizeTo: document.querySelector('.pixi-container'),
        antialias: true})
    document.body.appendChild(app.view)

    start()
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('keyup', onKeyUp)
    
    elapsed = 0
    app.ticker.add(update)
}