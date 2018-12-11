
const real = 1;
const serial = Number(require('./day11-data')[real]);

const grid = [];
for (let i=0; i<300; i++) {
  grid.push([]);
  for (let j=0; j<300; j++) {
    let power = ('' + (((((j+1) + 10) * (i+1)) + serial) * ((j+1) + 10)));
    if (power.length > 2) {
      power = Number(power.split('').reverse()[2]);
    } else {
      power = 0;
    }
    power -= 5;
    
    grid[i][j] = power;
  }
}

let holdMaxPower = 0;
let holdTopLeft = [];
for (let i=1; i<297; i++) {
  for (let j=1; j<297; j++) {
    let power = grid[i][j] + grid[i+1][j] + grid[i+2][j] + grid[i][j+1] + grid[i+1][j+1] + grid[i+2][j+1] + grid[i][j+2] + grid[i+1][j+2] + grid[i+2][j+2];
    if (power > holdMaxPower) {
      holdMaxPower = power;
      holdTopLeft = [j+1, i+1];
    }
  }
}

// console.log('122,79: ', grid[78][121]);
console.log(holdTopLeft);
