
const real = 1;
let data = require('./day9-data')[real].match(/^([0-9]+) players; last marble is worth ([0-9]+) points$/);
data = { playerCount: data[1], lastMarble: data[2] };

function main() {
  const start = (new Date()).getTime();

  let currentMarble = zero = new Marble(0);
  const players = (new Array(Number(data.playerCount))).fill(0, 0);
  let currentPlayer = 0;

  for (let i=1; i<=data.lastMarble; i++) {
    const marble = new Marble(i);
    
    if (i % 23) {
      currentMarble.clockwise.addClockwise(marble);
      currentMarble = marble;
    } else {
      const scored = currentMarble.getLeftSeven();
      players[currentPlayer] += (i + scored.value);
      currentMarble = scored.clockwise;
      scored.remove();
    }
    
    currentPlayer++;
    if (currentPlayer > players.length - 1) {
      currentPlayer = 0;
    }
    
    // zero.printCircle();
  }

  // console.log('scores:', players);
  console.log('high score:', Math.max.apply(null, players));
  console.log('time: ', ((new Date()).getTime() - start) / 1000);
}


class Marble {
  constructor(value) {
    this.value = value;
    this.clockwise = this;
    this.counter = this;
  }
  
  printCircle() {
    let circle = this.value;
    let nextMarble = this.clockwise;
    while(nextMarble.value !== this.value) {
      circle += ' ' + nextMarble.value;
      nextMarble = nextMarble.clockwise;
    }
    console.log(circle);
  }
  
  addClockwise(marble) {
    // if (this.clockwise) {
      this.clockwise.counter = marble;
    // }
    marble.clockwise = this.clockwise;
    marble.counter = this;
    this.clockwise = marble;
  }
  
  remove() {
      const clockwise = this.clockwise;
      const counter = this.counter;
      clockwise.counter = counter;
      counter.clockwise = clockwise;
      this.clockwise = null;
      this.counter = null;
    }
  
  getLeftSeven() {
    let marble = this;
    for (let i=0; i<7; i++) {
      marble = marble.counter;
    }
    return marble;
  }
}

main();
