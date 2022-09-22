function determineWinner({player, enemy, timerId}) {
  clearTimeout(timerId)
  document.querySelector('#displayText').style.display = 'flex'
  if (player.health === enemy.health) {
    document.querySelector('#displayText').innerHTML = 'Tie'
  } else if(player.health > enemy.health) {
    document.querySelector('#displayText').innerHTML = 'Player 1 Wins'
  } else{
    document.querySelector('#displayText').innerHTML = 'Player 2 Wins'
  }
}

let timer = 60
let timerId 
function decreaseTimer() {
  timerId = setTimeout(decreaseTimer, 1000)
  if (timer > 0) {
    timer --
    document.querySelector('#timer').innerHTML = timer
  }
  
  if (timer === 0) {
    determineWinner({player, enemy, timerId})
  }

  
}
