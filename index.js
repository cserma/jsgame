const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

canvas.width = 928
canvas.height = 793

context.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.3
const moveSpeed = 3
const jumpHeight = 14
const hitEffect = 3

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './assets/Background.png'
})

const player = new Fighter({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 30,
        y: 0
    },
    attackBox: {
        offset: {
            x: 60,
            y: 40
        },
        width: 100,
        height: 100
    },
    imageSrc: './assets/hashashin/idle.png',
    scale: 3,
    frameMax: 8,
    offset: {
        x:394,
        y:90
    },
    sprites: {
        idle: {
            imageSrc: './assets/hashashin/idle.png',
            frameMax: 8,
        },
        run: {
            imageSrc: './assets/hashashin/run.png',
            frameMax: 8,
        },
        jump: {
            imageSrc: './assets/hashashin/jump.png',
            frameMax: 3,
        },
        fall: {
            imageSrc: './assets/hashashin/fall.png',
            frameMax: 3,
        },
        attack1: {
            imageSrc: './assets/hashashin/attack1.png',
            frameMax: 7,
        },
        hit: {
            imageSrc: './assets/hashashin/hit.png',
            frameMax: 6,
        },
        death: {
            imageSrc: './assets/hashashin/death.png',
            frameMax: 19,
        },
    }
})

const enemy = new Fighter({
    position: {
        x: 800,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    attackBox: {
        offset: {
            x: -105,
            y: 50
        },
        width: 100,
        height: 100
    },
    imageSrc: './assets/templar/Idle.png',
    scale: 2.3,
    frameMax: 8,
    offset: {
        x:178,
        y:114
    },
    sprites: {
        idle: {
            imageSrc: './assets/templar/Idle.png',
            frameMax: 11,
        },
        run: {
            imageSrc: './assets/templar/Run.png',
            frameMax: 8,
        },
        jump: {
            imageSrc: './assets/templar/Jump.png',
            frameMax: 3,
        },
        fall: {
            imageSrc: './assets/templar/Fall.png',
            frameMax: 3,
        },
        attack1: {
            imageSrc: './assets/templar/Attack1.png',
            frameMax: 7,
        },
        hit: {
            imageSrc: './assets/templar/Hit.png',
            frameMax: 4,
        },
        death: {
            imageSrc: './assets/templar/Death.png',
            frameMax: 11,
        },
    }
})

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    }
}

function detectCollision({ rectangle1, rectangle2 }) {
    return (rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x
        && rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width
        && rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y
        && rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
        )
}

let timer = 60
function decreaseTimer() {
    if (timer > 0) {
        setTimeout(decreaseTimer,1000)
        timer--
        document.querySelector('#timer').innerHTML = timer
    } 
    if (timer == 0) {
        let resultText = document.querySelector('#resultText')
        resultText.style.display = 'flex'
        if (player.health === enemy.health) {
            resultText.innerHTML = 'Tie'
        } else if (player.health > enemy.health) {
            resultText.innerHTML = 'Player 1 Wins'
        } else if (player.health < enemy.health) {
            resultText.innerHTML = 'Player 2 Wins'
        }
    }
    
}

decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate)
    context.fillStyle = 'black'
    context.fillRect(0, 0, canvas.width, canvas.height)
    
    background.update()

    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0

    

    // player
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -moveSpeed
        player.switchSprite('run')
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = moveSpeed
        player.switchSprite('run')
    } else {
        player.switchSprite('idle')
    }

    if (player.velocity.y < 0){
        player.switchSprite('jump')
    } else if (player.velocity.y > 0){
        player.switchSprite('fall')
    }

    // enemy
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -moveSpeed
        enemy.switchSprite('run')
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = moveSpeed
        enemy.switchSprite('run')
    } else {
        enemy.switchSprite('idle')
    }

    if (enemy.velocity.y < 0){
        enemy.switchSprite('jump')
    } else if (enemy.velocity.y > 0){
        enemy.switchSprite('fall')
    }

    // player attack collision
    if (detectCollision({ rectangle1:player, rectangle2:enemy})
        && player.isAttacking
        && player.frameCurrent === 2){
        enemy.takeHit()
        document.querySelector('#enemyHealth').style.width = enemy.health + '%'
        enemy.velocity.y = -hitEffect
        enemy.velocity.x = hitEffect
        player.isAttacking = false
    }
    if (player.isAttacking && player.frameCurrent === 2) {
        player.isAttacking = false
    }


    // enemy attack collision
    if (detectCollision({ rectangle1:enemy, rectangle2:player})
        && enemy.isAttacking
        && enemy.frameCurrent === 3){
        player.takeHit()
        document.querySelector('#playerHealth').style.width = player.health + '%'
        player.velocity.y = -hitEffect
        player.velocity.x = -hitEffect
        enemy.isAttacking = false
    }
    if (enemy.isAttacking && enemy.frameCurrent === 3) {
        enemy.isAttacking = false
    }


    if (player.health <= 0 || enemy.health <= 0) timer = 0
}

animate()

window.addEventListener('keydown', (event) => {
    switch(event.key) {
        case 'd':
            keys.d.pressed = true
            player.lastKey = 'd'
            break
        case 'a':
            keys.a.pressed = true
            player.lastKey = 'a'
            break
        case 'w':
            player.velocity.y = -jumpHeight
            break
        case ' ':
            player.attack()
            break
        
        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastKey = 'ArrowRight'
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastKey = 'ArrowLeft'
            break
        case 'ArrowUp':
            enemy.velocity.y = -jumpHeight
            break
        case 'Shift':
            enemy.attack()
            break
    }
})
window.addEventListener('keyup', (event) => {
    switch(event.key) {
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
    }
})