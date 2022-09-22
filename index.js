const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.5

const background = new Sprite({
  position: {
    x: 0,
    y: 0
  }, imageSrc: './img/background.png'
})

const shop = new Sprite({
  position: {
    x: 625,
    y: 132
  }, 
  imageSrc: './img/shop.png',
  scale: 2.75,
  framesMax: 6
})

const player = new Fighter({
  position: {
    x: 100,
    y: 0
  },
  velocity: {
    x: 0,
    y: 0
  },
  offset: {
    x: 0,
    y: 0,
  },
  
  imageSrc: './img/samuraiMack/Idle.png',
  framesMax: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 157
  },
  sprites: {
    idle: {
      imageSrc: './img/samuraiMack/Idle.png',
      framesMax: 8
    },
    run: {
      imageSrc: './img/samuraiMack/run.png',
      framesMax: 8
    },

    jump: {
      imageSrc: './img/samuraiMack/Jump.png',
      framesMax: 2
    },

    fall: {
      imageSrc: './img/samuraiMack/Fall.png',
      framesMax: 2
    },

    attack1: {
      imageSrc: './img/samuraiMack/Attack1.png',
      framesMax: 6
    },

    takeHit: {
      imageSrc: './img/samuraiMack/Take Hit - white silhouette.png',
      framesMax: 4
    },

    death: {
      imageSrc: './img/samuraiMack/Death.png',
      framesMax: 6
    },
  },
  attackBox: {
    offset: {
      x: 70,
      y: 40,
  },
  width: 177,
  height: 50
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
  color: 'blue',
  offset: {
    x: 50,
    y: 0
  },
  imageSrc: './img/kenji/Idle.png',
  framesMax: 4,
  scale: 2.5,
  offset: {
    x: 215,
    y: 167
  },
  sprites: {
    idle: {
      imageSrc: './img/kenji/Idle.png',
      framesMax: 4
    },
    run: {
      imageSrc: './img/kenji/run.png',
      framesMax: 8
    },

    jump: {
      imageSrc: './img/kenji/Jump.png',
      framesMax: 2
    },

    fall: {
      imageSrc: './img/kenji/Fall.png',
      framesMax: 2
    },

    attack1: {
      imageSrc: './img/kenji/Attack1.png',
      framesMax: 4
    },

    takeHit: {
      imageSrc: './img/kenji/Take hit.png',
      framesMax: 3
    },

    death: {
      imageSrc: './img/kenji/Death.png',
      framesMax: 7
    }
  },
  attackBox: {
    offset: {
      x: -175,
      y: 50,
  },
  width: 177,
  height: 50
}
  })


const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  ArrowRight: {
    pressed: false
  },
  ArrowLeft: {
    pressed: false
  }
}

function rectangularCollision({rectangle1, rectangel2}) {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangel2.position.x &&
    rectangle1.attackBox.position.x <= rectangel2.position.x + rectangel2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangel2.position.y&&
    rectangle1.attackBox.position.y <= rectangel2.position.y + rectangel2.height 
  )
}

decreaseTimer()

function animate() {
  
  window.requestAnimationFrame(animate)

  c.fillStyle = 'black'
  c.fillRect(0, 0, canvas.width, canvas.height)

  background.update()
  shop.update()
  c.fillStyle = 'rgba(255, 255, 255, 0.15)'
  c.fillRect(0, 0, canvas.width, canvas.height)
  player.update()
  enemy.update()

  player.velocity.x = 0
  enemy.velocity.x = 0

  //player movement
  if (keys.a.pressed && player.lastKey ==='a') {
    player.velocity.x = -5
    player.switchSprite('run')
  } else if (keys.d.pressed && player.lastKey === 'd') {
    player.velocity.x = 5
    player.switchSprite('run')
  } else{
    player.switchSprite('idle')
  }

  if (player.velocity.y < 0) {
    player.switchSprite('jump')
  }else if(player.velocity.y > 0) {
    player.switchSprite('fall')
  }

  //enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
    enemy.velocity.x = -5
    enemy.switchSprite('run')
  } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
    enemy.velocity.x = 5
    enemy.switchSprite('run')
  } else{
    enemy.switchSprite('idle')
  }

  if (enemy.velocity.y < 0) {
    enemy.switchSprite('jump')
  }else if(enemy.velocity.y > 0) {
    enemy.switchSprite('fall')
  }

  //detect for collision
  if (
    player.attackBox.position.x + player.attackBox.width >= enemy.position.x &&
    player.attackBox.position.x <= enemy.position.x + enemy.width &&
    player.attackBox.position.y + player.attackBox.height >= enemy.position.y&&
    player.attackBox.position.y <= enemy.position.y + enemy.height  &&
    player.isAttacking && player.framesCurrent === 4
    ) {
    enemy.takeHit()
    player.isAttacking = false

    gsap.to('#enemyHealth', {
      width: enemy.health +  '%'
    })

  }

  //if player misses
  if (player.isAttacking && player.framesCurrent === 4) {
    player.isAttacking = false 
  }


  if (
    enemy.attackBox.position.x + enemy.attackBox.width >= player.position.x &&
    enemy.attackBox.position.x <= player.position.x + player.width &&
    enemy.attackBox.position.y + enemy.attackBox.height >= player.position.y&&
    enemy.attackBox.position.y <= player.position.y + player.height  &&
    enemy.isAttacking && enemy.framesCurrent === 1
    ) {
    player.takeHit()
    enemy.isAttacking = false

    gsap.to('#playerHealth', {
      width: player.health +  '%'
    })
  }

  //if enemy misses
  if (enemy.isAttacking && enemy.framesCurrent === 1) {
    enemy.isAttacking = false
  }

  //end game based on health
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({player, enemy, timerId})
  }
}

animate()


window.addEventListener('keydown', (event) => {
  if (!player.dead) {
    switch (event.key) {
      case 'd':
        keys.d.pressed = true
        player.lastKey = 'd'
        break
      
      case 'a':
        keys.a.pressed = true
        player.lastKey = 'a'
        break
  
      case 'w':
        player.velocity.y = -15
        break
      
      case ' ':
        player.attack()
        break
    }
  }
  
  if (!enemy.dead) {
    switch (event.key) {
      case 'ArrowRight':
        keys.ArrowRight.pressed = true
        enemy.lastKey = 'ArrowRight'
        break
      
      case 'ArrowLeft':
        keys.ArrowLeft.pressed = true
        enemy.lastKey = 'ArrowLeft'
        break
  
      case 'ArrowUp':
        enemy.velocity.y = -15
        break   
        
      case 'ArrowDown':
        enemy.attack()
    }
  }
})

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = false
      break

    case 'a':
      keys.a.pressed = false
      break

    case 'w':
      break
  }

  switch (event.key) {
    case 'ArrowRight':
      keys.ArrowRight.pressed = false
      break

    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false
      break

    case 'ArrowUp':
      break
  }
})