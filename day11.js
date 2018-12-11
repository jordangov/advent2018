
const real = 1;
const serial = Number(require('./day11-data')[real]);
const gridSize = 300;

const grid = [];
for (let i=0; i<gridSize; i++) {
  grid.push([]);
  for (let j=0; j<gridSize; j++) {
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
for (let i=0; i<gridSize; i++) {
  for (let j=0; j<gridSize; j++) {
    
    let prevPower = grid[i][j];
    
    for (let l=1; l<(gridSize-(Math.max(i, j))); l++) {
      let power = prevPower;
      
      for (let m=0; m<l; m++) {
        power += (grid[i+m][j+l] + grid[i+l][j+m]);
      }
      power += grid[i+l][j+l]; // catch the corner
      
      prevPower = power;
      
      if (power > holdMaxPower) {
        holdMaxPower = power;
        holdTopLeft = [j+1, i+1, l+1];
        // console.log('new max:', holdTopLeft, holdMaxPower);
      }
    }
  }
}

// console.log('122,79: ', grid[78][121]);
// Serial 18 = 90,269,16
console.log('winner winner chicken dinner:', holdTopLeft, holdMaxPower);
