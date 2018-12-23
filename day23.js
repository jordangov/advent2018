
const input = Number(process.argv[2]) || 0;
const data = require('./day23-data')[input].split(/\n/);

const bots = data.map((entry) => {
  const bot = entry.split(/, /);
  
  let position = bot[0].split(/=/)[1].substr(1);
  position = position.substr(0, position.length-1);
  position = position.split(/,/).map((c) => { return Number(c); })
  
  return {
    pos: position,
    r: Number(bot[1].split(/=/)[1])
  }
});

// console.log(bots);

let holdLargestRange = 0;
let holdBot = null;
bots.forEach((bot1) => {
  bot1.inRange = [];
  if (bot1.r === holdLargestRange) { console.log('duplicate range!', bot1.r); }
  if (bot1.r > holdLargestRange) {
    holdLargestRange = bot1.r;
    holdBot = bot1;
  }
  
  bots.forEach((bot2) => {
    const distance = Math.abs(bot1.pos[0]-bot2.pos[0]) + Math.abs(bot1.pos[1]-bot2.pos[1]) + Math.abs(bot1.pos[2]-bot2.pos[2]);
    if (distance < bot1.r+1) {
      bot1.inRange.push(bot2);
      // console.log(`bot at ${bot1.pos} has ${bot2.pos} in range with distance ${distance}`);
    }
  });
});

console.log(`largest range is ${holdBot.r} on bot at ${holdBot.pos} with ${holdBot.inRange.length} bots in range.`);
